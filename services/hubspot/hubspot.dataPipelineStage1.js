const axios = require("axios");
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoDB = require("mongodb");
require("dotenv").config();
const {
    authUrl,
    handleOAuthCallback,
    refreshAccessToken,
    getAccessToken,
} = require("../../services/hubspot/hubspotOAuth");
const { con, connect } = require("../../database/mongoDB/connection");
const hubspotURLList = require("../../helpers/hubspot/hubspot.dataExtractionURIS.helper.json");

//---------BullMQ and Redis set up .... ( will later move to a dedicated export ) ----------
const { Queue } = require("bullmq");
const {Redis , IORedis} = require("ioredis");


// const hubspotETLQueue = new Queue("hubspotCRMQueue",  { connection : { host : "localhost" , port : 6379} });



exports.extractHubspotCRMData = async (userId) => {
    const dbCLient = await connect();
    const db = dbCLient.db(userId);
    const collection = db.collection("ThirdPartyAuthDetails");
    const authDocs = await collection.find({});

    let authList = [];

    for await (const doc of authDocs) {
        authList.push(doc);
    }

    let authToken = authList[0]["Hubspot"]["access_token"];
    const refreshToken = authList[0]["Hubspot"]["refresh_token"];

    //attempting wqueues ----
    for (const url of hubspotURLList["crm"]) {
        const urlName = Object.keys(url)[0]
        const urlValue = Object.values(url)[0]
        const payload = {
            userId: userId,
            authToken: authToken,
            refreshToken: refreshToken,
            urlValue: urlValue,
            urlName: urlName
        };
        const jobName = "ExtractHubspotDataIntoMongoDB";
        console.log(payload);
        await hubspotETLQueue.add(jobName, payload);
    }
    return hubspotETLQueue.getQueueEvents();

    //attempting wqueues ----

    // for (const url of hubspotURLList["crm"]) {
    //     let start = performance.now()
    //     console.log("url ---++++" , url)
    //     for_count++
    //     const dataLoadCollection = dbCLient
    //         .db(userId)
    //         .collection(Object.keys(url)[0]);
    //     let apiTrigger = true;
    //     let apiUrl = Object.values(url)[0];
    //     while (apiTrigger) {
    //         try {
    //             while_count++
    //             const response = await axios({
    //                 url: apiUrl,
    //                 method: "get",
    //                 headers: { Authorization: `Bearer ${authToken}` },
    //             });

    //             if (response.status === 200) {
    //                 const data = response["data"]["results"];
    //                 console.log(data.length);
    //                 console.log("keys of result" , Object.keys(response))
    //                 await dataLoadCollection.insertMany(data);
    //                 if (Object.keys(response["data"]).includes("paging")) {
    //                     apiUrl = response["data"]["paging"]["next"]["link"];
    //                     console.log("apiurl>>>>>" , apiUrl)
    //                 } else if (!Object.keys(response["data"]).includes("paging")) {
    //                     console.log("keys of result when fucky happens xxxxxxxxxxx" , Object.keys(response))
    //                     apiTrigger = false;
    //                 }

    //                 result.push(`Data extracted yo boi`);
    //                 result_count++
    //             }
    //         } catch (error) {
    //             let end = performance.now()
    //             console.log(end - start)
    //             console.log(error?.message)
    //             console.log(error?.statusCode)
    //             console.log("for---" , for_count)
    //             console.log("while---" , while_count)
    //             console.log("!!!!!error!!!!!============" , Object.keys(error))
    //             console.log("!!!!!errorxxxxxxxxxxxxxcode!!!!!============" , JSON.stringify(error?.code))
    //             console.log("!!!!!errorxxxxxxxxxxxxxMESSAGE!!!!!============" , JSON.stringify(error?.message))
    //             console.log("!!!!!errorxxxxxxxxxxxxxCAUSE!!!!!============" , JSON.stringify(error?.cause))
    //             console.log("!!!!!errorRESPONSESTATUS!!!!!============" , JSON.stringify(error?.response?.status))
    //             // console.log("!!!!!errorREQUEST!!!!!============" , JSON.stringify(error?.request))
    //             // console.log("!!!!!errorRESPONSESTATUS!!!!!============" , JSON.stringify(error?.request?.status))

    //             if ( JSON.stringify(error.response.status) && JSON.stringify(error.response.status) == '401') {

    //                     const newTokens = await getAccessToken(
    //                         userId,
    //                         refreshToken
    //                     );
    //                     console.log("------refreshing tokens --------------");
    //                     console.log("////////NEW TOKENS||||||||||||" , newTokens)

    //                     authToken = newTokens["access_token"]
    //                     await collection.updateOne(
    //                         { "userId": userId },
    //                         { "$set": { userId: userId, Hubspot: newTokens } },
    //                         { "upsert": true }
    //                     );

    //             }
    //             result.push(`Data faild yo boi`);
    //             console.log("her is the probloem")
    //         }
    //     }
    // }
    // return {result , result_count };
};
