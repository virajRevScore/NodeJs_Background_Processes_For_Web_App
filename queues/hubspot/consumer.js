const {
    handlerFailure,
    handlerCompleted,
    handlerStalled,
} = require("./handler");

const path = require("path");
const axios = require("axios");

const { Client } = require('pg');
const { Transform } = require('stream');
const knex = require('knex');

const { con, connect } = require("../../database/mongoDB/connection");
const { getAccessToken } = require("../../services/hubspot/hubspotOAuth.js");

const { Worker, Queue } = require("bullmq");
const { loadHubspotCRMDataToPostgres } = require("../../services/hubspot/hubspot.dataPipelineStage2");
const { sqldb } = require("../../database/postgreSQL/knexConfig");


// stage 1 extracts data from hubspot and dumps it all into mongodb

const processJobStage1 = async (job, done) => {
    console.log("heredata", job.data.userId);

    const dbCLient = await connect();
    const db = dbCLient.db(job.data.userId);
    console.log("hereDB");
    const loadPointCollection = db.collection(job.data.urlName);
    console.log("not here");
    let apiUrl = job.data.urlValue;

    let apiTrigger = true;

    while (apiTrigger) {
        try {
            const response = await axios({
                url: apiUrl,
                method: "get",
                headers: { Authorization: `Bearer ${job.data.authToken}` },
            });

            if (response.status === 200) {
                const data = response["data"]["results"];
                // console.log(data.length);
                // console.log("keys of result", Object.keys(response));
                await loadPointCollection.insertMany(data);
                if (Object.keys(response["data"]).includes("paging")) {
                    apiUrl = response["data"]["paging"]["next"]["link"];
                    // console.log("apiurl>>>>>", apiUrl);
                } else if (!Object.keys(response["data"]).includes("paging")) {
                    apiTrigger = false;
                }
            }
        } catch (error) {
            console.log(error);
            if (
                JSON.stringify(error.response.status) &&
                JSON.stringify(error.response.status) == "401"
            ) {
                const newTokens = await getAccessToken(
                    job.data.userId,
                    job.data.refreshToken
                );
                console.log("------refreshing tokens --------------");
                console.log("////////NEW TOKENS||||||||||||", newTokens);

                authToken = newTokens["access_token"];
                await db
                    .collection("ThirdPartyAuthDetails")
                    .updateOne(
                        { userId: job.data.userId },
                        {
                            $set: {
                                userId: job.data.userId,
                                Hubspot: newTokens,
                            },
                        },
                        { upsert: true }
                    );

                job.data.authToken = authToken;
                job.data.refreshToken = newTokens["refresh_token"];
                console.log("this is job   refreshed----", job.data);
            }
        }
    }
};


//stage 2 extracts data from mongodb , performs minor transformations and loads it into postgresql

const processJobStage2 = async (job , done) => {
    const transformStream = new Transform({
        objectMode: true,
        highWaterMark : 100,
        transform: function (doc, encoding, callback) {
          const transformedDoc = doc.properties
          callback(null, transformedDoc);
        },
      });
      
    const dbCLient = await connect();
    const db = dbCLient.db(job.data.userId);
    const extractPointCollection = db.collection(job.data.collectionAndTableName);

    const cursor = extractPointCollection.find({}).stream()
    cursor.pipe(transformStream);

    const pgWritableStream = new Transform({
        objectMode: true,
        highWaterMark: 100, // Adjust the high water mark as per your requirements
        transform: function (doc, encoding, callback) {
          sqldb
            .insert({ userId : job.data.userId , tenantId : job.data.userId , ...doc})
            .into(job.data.collectionAndTableName)
            .then(() => callback())
            .catch((error) => callback(error));
        },
      });
  
      transformStream
      .pipe(pgWritableStream)
        .on('data', (data) => {
          if (!pgWritableStream.write(data)) {
            transformStream.pause();
          }
        })
        .on('end', () => {
          pgWritableStream.end();
        });
    
      pgWritableStream
        .on('drain', () => {
          transformStream.resume();
        })
        .on('finish', () => {
          console.log('Data inserted into PostgreSQL successfully!');
        //   mongoClient.close();
        //   pgClient.end();
        //   knexClient.destroy();
        })
        .on('error', (error) => {
          console.error('Error inserting data into PostgreSQL:', error);
        //   mongoClient.close();
        //   pgClient.end();
        //   knexClient.destroy();
        });
    
}



const hubspotWorkerStage1 = new Worker("hubspotCRMQueueStage1", processJobStage1, {
    connection: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST },
});
const hubspotWorkerStage2 = new Worker("hubspotCRMQueueStage2", processJobStage2, {
    connection: { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST },
});

hubspotWorkerStage1.on("completed" , (job) => {
    loadHubspotCRMDataToPostgres(job.data.userId , job.data.urlName)
    }
)
hubspotWorkerStage2.on("completed" , () => {
    console.log("2222222222222222222222222222222222222222222222")
    }
)

module.exports = { hubspotWorkerStage1, processJobStage1 };
