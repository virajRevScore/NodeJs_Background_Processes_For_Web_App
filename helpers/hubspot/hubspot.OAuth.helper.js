const axios = require("axios");
var querystring = require("querystring");
// const { refreshAccessToken } = require("../../services/hubspot/hubspotOAuth");



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
    console.log(typeof(responseBody.data));

    console.log("       > Received an access token and refresh token");
    return tokens;
  } catch (e) {
    console.error(
      `       > Error exchanging ${exchangeProof.grant_type} for access token`
    );
    return JSON.parse(e);
  }
};



// exports.getAccessToken = async (userId) => {

 
//     await refreshAccessToken(userId);
 
// };

exports.isAuthorized = (userId) => {
  return refreshTokenStore[userId] ? true : false;
};
