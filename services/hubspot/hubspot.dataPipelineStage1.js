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


const { addJobsToHubspotCRMQueue } = require("../../queues/hubspot/producer");





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

    return await addJobsToHubspotCRMQueue( hubspotURLList["crm"] , userId , authToken , refreshToken)
  
   

}
