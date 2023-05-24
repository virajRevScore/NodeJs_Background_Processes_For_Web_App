const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoDB = require("mongodb");
require("dotenv").config();
const { authUrl, handleOAuthCallback , refreshAccessToken } = require("../../services/hubspot/hubspotOAuth");
const { con, connect } = require("../../database/mongoDB/connection");


exports.getAuth = async (req, res) => {
  const params = req.query;
  const connection = await connect();
  const adminDb = connection.db("revScoreAdmin");
  let currentSession = req.session;
  const data = await adminDb
    .collection("tenants")
    .findOne({ userId: params.userId });
  if (!data) {
    const newData = await adminDb.collection("tenants").insertOne({
      userId: params.userId,
      sessionId: req.sessionID,
    });
    console.log("new", newData);
    if (newData.acknowledged === true) {
      currentSession.userId = params.userId;

      console.log(req.session);
      res.redirect(authUrl);
    } else {
      return res.status(500);
    }
  } else {
    console.log(data.userId);

    currentSession.userId = data.userId;
    res.redirect(authUrl);
  }
};

exports.createAccessTokenFromHubspotCallback = async (req, res) => {
  if (req.query.code) {
    const token = await handleOAuthCallback(req.query.code, req.sessionID);

    if (token.message) {
      return res.redirect(`/error?msg=${token.message}`);
    }

    const userId = req.session.userId;
    console.log("userId Db ----", userId);
    const client = await connect();
    const tenantDb = client.db(userId);
    const data = await tenantDb
      .collection("ThirdPartyAuthDetails")
      .updateOne({ "userId" : userId} ,{ "$set" :{userId : userId ,  Hubspot: token }}, { upsert: true });
    res.redirect("/");
  }
};

exports.getRefreshedToken = async (req, res) => {
  const client = await connect();
  const userDb = await client
    .db(req.query.userId)
    .collection("ThirdPartyAuthDetails");
  const cursor = await userDb.find({});
  let authDetails = [];
  for await (const doc of cursor) {
    console.log(doc);
    authDetails.push(doc);
  }
  // console.log(cursor)
  const refreshToken = authDetails[0]["Hubspot"]["refresh_token"];
  const refreshedAccessToken = await refreshAccessToken(
    req.query.userId,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    `http://localhost:${process.env.PORT}/api/v1/background_processes/onboarding/hubspotOAuthCallback`,
    refreshToken
  );
  const newHubspotTokens = await userDb.updateOne({userId : req.query.userId} , {"$set" : {Hubspot : refreshedAccessToken}})
  res.json({"refreshedToken" : refreshedAccessToken})
};
