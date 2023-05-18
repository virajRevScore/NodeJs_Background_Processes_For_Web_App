const axios = require('axios')
var querystring = require('querystring');
exports.exchangeForTokens = async (userId, exchangeProof) => {
  try {
    const responseBody= await axios({
        url : "https://api.hubapi.com/oauth/v1/token",
        method : 'post',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded"
          },
        data : querystring.stringify(exchangeProof)        
  }) 

    // Usually, this token data should be persisted in a database and associated with
    // a user identity.
   
    // const tokens = JSON.parse(responseBody.data);
    // refreshTokenStore[userId] = tokens.refresh_token;
    // accessTokenCache.set(
    //   userId,
    //   tokens.access_token,
    //   Math.round(tokens.expires_in * 0.75)
    // );
    const tokens = responseBody.data
    console.log(responseBody.data)

    console.log("       > Received an access token and refresh token");
    return tokens;
  } catch (e) {
    console.error(
      `       > Error exchanging ${exchangeProof.grant_type} for access token`
    );
    return JSON.parse(e);
  }
};

exports.refreshAccessToken = async (userId) => {
  const refreshTokenProof = {
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    refresh_token: refreshTokenStore[userId],
  };
  return await exchangeForTokens(userId, refreshTokenProof);
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
