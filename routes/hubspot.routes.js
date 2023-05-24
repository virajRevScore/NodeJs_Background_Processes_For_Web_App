const router = require('express').Router()


const hubspotOAuthController = require('../controllers/hubspot/OAuth')
const hubspotETLController = require('../controllers/hubspot/ETL')

//OAuth------------------------------

router.get('/hubspotIntegration'  ,  hubspotOAuthController.getAuth)
router.get('/hubspotOAuthCallback' , hubspotOAuthController.createAccessTokenFromHubspotCallback)
router.get('/hubspotRefreshToken' , hubspotOAuthController.getRefreshedToken)

//OAuth------------------------------
//DataPipeline --- Hubspot to mongoDB

router.get('/hubspotETL' , hubspotETLController.hubspotETLStage1)

//DataPipeline --- Hubspot to mongoDB

module.exports = router
