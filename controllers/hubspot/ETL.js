const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoDB = require("mongodb");
require("dotenv").config();
const { authUrl, handleOAuthCallback , refreshAccessToken } = require("../../services/hubspot/hubspotOAuth");
const { con, connect } = require("../../database/mongoDB/connection");

const { extractHubspotCRMData } = require("../../services/hubspot/hubspot.dataPipelineStage1");



exports.hubspotETLStage1 = async (req , res) => {
    // const dbClient = await connect()
    // const db = dbClient.db(req.query.userId)
    // const collection = db.collection('ThirdPartyAuthDetails')
    // const authDocs = await collection.find({})
    // let authList = []
    // for await  (const doc of authDocs) {
    //     authList.push(doc)
    // }

    // const authToken = authList[0]["Hubspot"]['access_token']
    // const refreshToken = authList[0]["Hubspot"]['refresh_token']
    // console.log(authToken , refreshToken)
    const result = await extractHubspotCRMData( req.query.userId)
    res.json({ "data_extract_load_length" : result.result.length , "count" : result.result_count})
//     for (let url in hubspotURLList) {

//     }
}