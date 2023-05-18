// const { authUrl } = require("../../services/hubspotOAuth")

const { authUrl , handleOAuthCallback} = require("../../services/hubspotOAuth")


exports.getAuth = (req , res) => {
    console.log("Clear here")      
    res.redirect(authUrl)
} 

exports.createAccessTokenFromHubspotCallback = async (req , res) => {
    console.log("query.code" , req.query.code)
    console.log("sessionId" , req.sessionId)
    if(req.query.code){
       const token = await handleOAuthCallback(req.query.code , req.sessionId) 
       console.log("token >>>>>>>>>>>>>>>>>>>>>>>" ,token)

       if (token.message) {
        return res.redirect(`/error?msg=${token.message}`);
      }
      res.redirect('/')
       

    }
}