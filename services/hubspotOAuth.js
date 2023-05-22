require("dotenv").config();
const express = require("express");
const open = require("opn");

const helper = require("../helpers/hubspot.OAuth.helper");

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Missing CLIENT_ID or CLIENT_SECRET environment variable.");
}

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let SCOPES;
SCOPES = process.env.SCOPES.split(/%20/).join();

// On successful install, users will be redirected to /oauth-callback
const REDIRECT_URI = `http://localhost:${process.env.PORT}/api/v1/background_processes/onboarding/hubspotOAuthCallback`;

exports.authUrl =
  "https://app.hubspot.com/oauth/authorize" +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` + // app's client ID
  `&scope=${encodeURIComponent(SCOPES)}` + // scopes being requested by the app
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`; // where to send the user after the consent page

exports.handleOAuthCallback = async (code, sessionId) => {
  const authCodeProof = {
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: code,
  };

  const accessAndRefreshTokens = await helper.exchangeForTokens(
    sessionId,
    authCodeProof
  );

  return accessAndRefreshTokens;
};

exports.refreshAccessToken = async (
  userId,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  refreshToken
) => {
  const refreshTokenProof = {
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: refreshToken,
  };
  return await helper.exchangeForTokens(userId, refreshTokenProof);
};
