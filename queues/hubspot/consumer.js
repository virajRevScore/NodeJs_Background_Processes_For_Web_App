
const { handlerFailure, handlerCompleted, handlerStalled } = require('./handler')

const path = require('path')
const axios = require('axios')

const { con, connect } = require("../../database/mongoDB/connection");
const {
    getAccessToken,
} = require('../../services/hubspot/hubspotOAuth.js');


const queueName = 'hubspotCRMQueue '


const {Worker , Queue} = require("bullmq")


const processJob = async (job, done) => {
  
    console.log("heredata" , job.data.userId)
    
    const dbCLient = await connect();
    const db = dbCLient.db(job.data.userId);
    console.log("hereDB")
    const loadPointCollection = db.collection(job.data.urlName);
    console.log("not here")
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
                console.log(data.length);
                console.log("keys of result", Object.keys(response));
                await loadPointCollection.insertMany(data);
                if (Object.keys(response["data"]).includes("paging")) {
                    apiUrl = response["data"]["paging"]["next"]["link"];
                    console.log("apiurl>>>>>", apiUrl);
                } else if (!Object.keys(response["data"]).includes("paging")) {
                    apiTrigger = false;
                }
            }
        } catch (error) {
            console.log(error)
            if (
                JSON.stringify(error.response.status) &&
                JSON.stringify(error.response.status) == "401"
            ) {
                const newTokens = await getAccessToken(job.data.userId, job.data.refreshToken);
                console.log("------refreshing tokens --------------");
                console.log("////////NEW TOKENS||||||||||||", newTokens);

                authToken = newTokens["access_token"];
                await db.collection("ThirdPartyAuthDetails").updateOne(
                    { userId: job.data.userId },
                    { $set: { userId: job.data.userId, Hubspot: newTokens } },
                    { upsert: true }
                );
                
                job.data.authToken = authToken
                job.data.refreshToken = newTokens["refresh_token"]
                console.log("this is job   refreshed----" , job.data)
            }   
        }
    }
}
const hubspotWorker = new Worker("hubspotCRMQueue" , processJob , {
    connection : { port: process.env.REDIS_PORT, host: process.env.REDIS_HOST }
  })

module.exports = { hubspotWorker , processJob}
