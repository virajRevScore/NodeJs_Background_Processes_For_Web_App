const router = require('express').Router()


const hubspotOAuthController = require('../controllers/hubspot/OAuth')

//OAuth------------------------------

router.get('/hubspotIntegration'  ,  hubspotOAuthController.getAuth)
router.get('/hubspotOAuthCallback' , hubspotOAuthController.createAccessTokenFromHubspotCallback)
router.get('/hubspotRrefreshToken' , hubspotOAuthController.getRefreshedToken)

//OAuth------------------------------
//DataPipeline --- Hubspot to mongoDB

//DataPipeline --- Hubspot to mongoDB

module.exports = router
