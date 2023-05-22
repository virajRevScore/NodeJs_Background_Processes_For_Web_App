const axios = require("axios");
var querystring = require("querystring");

exports.exchangeForTokens = async (userId, exchangeProof) => {
  try {
    const responseBody = await axios({
      url: "https://api.hubapi.com/oauth/v1/token",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: querystring.stringify(exchangeProof),
    });

    const tokens = responseBody.data;
    console.log(responseBody.data);

    console.log("       > Received an access token and refresh token");
    return tokens;
  } catch (e) {
    console.error(
      `       > Error exchanging ${exchangeProof.grant_type} for access token`
    );
    return JSON.parse(e);
  }
};



exports.getAccessToken = async (userId) => {
  // If the access token has expired, retrieve
  // a new one using the refresh token
  if (!accessTokenCache.get(userId)) {
    console.log("Refreshing expired access token");
    await refreshAccessToken(userId);
  }
  return accessTokenCache.get(userId);
};

exports.isAuthorized = (userId) => {
  return refreshTokenStore[userId] ? true : false;
};
