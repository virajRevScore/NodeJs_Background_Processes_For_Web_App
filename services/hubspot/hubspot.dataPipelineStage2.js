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


const { addJobsToHubspotCRMQueueStage2 } = require("../../queues/hubspot/producer");





exports.loadHubspotCRMDataToPostgres = async (userId , collectionAndTableName) => {
   

    return await addJobsToHubspotCRMQueueStage2( userId , collectionAndTableName )
  
   

}
