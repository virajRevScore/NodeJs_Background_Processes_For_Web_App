const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoDB = require("mongodb");
require("dotenv").config();
const { authUrl, handleOAuthCallback , refreshAccessToken } = require("../../services/hubspot/hubspotOAuth");
const { con, connect } = require("../../database/mongoDB/connection");

const { extractHubspotCRMData } = require("../../services/hubspot/hubspot.dataPipelineStage1");




exports.hubspotETLStage1 = async (req , res) => {
   
    const result = await extractHubspotCRMData( req.query.userId )
    res.json({ message : "data extraction of HubSpot has begun. Please wait while we curate your dashboard....." , result : result})

}