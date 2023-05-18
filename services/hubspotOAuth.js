require('dotenv').config();
const express = require('express');
const open = require('opn')

// const request = require('request-promise-native');
// const NodeCache = require('node-cache');
// const session = require('express-session');

const helper = require('../helpers/hubspot.OAuth.helper')

const refreshTokenStore = {};
// const accessTokenCache = new NodeCache({ deleteOnExpire: true });

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    throw new Error('Missing CLIENT_ID or CLIENT_SECRET environment variable.')
}

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let SCOPES
SCOPES = (process.env.SCOPES.split(/%20/)).join( )

// On successful install, users will be redirected to /oauth-callback
const REDIRECT_URI = `http://localhost:${process.env.PORT}/api/v1/background_processes/onboarding/hubspot-oauth-callback`;



exports.authUrl =
  'https://app.hubspot.com/oauth/authorize' +
  `?client_id=${encodeURIComponent(CLIENT_ID)}` + // app's client ID
  `&scope=${encodeURIComponent(SCOPES)}` + // scopes being requested by the app
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`; // where to send the user after the consent page

exports.handleOAuthCallback = async (code , sessionId) => {
  const authCodeProof = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code: code
  };

  const accessAndRefreshTokens = await helper.exchangeForTokens(sessionId, authCodeProof);
  
  
  return accessAndRefreshTokens

  // Once the tokens have been retrieved, use them to make a query
  // to the HubSpot API
  
}

