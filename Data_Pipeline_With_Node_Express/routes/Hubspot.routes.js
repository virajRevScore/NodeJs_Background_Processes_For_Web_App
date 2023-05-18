const router = require('express').Router()

const hubspotOAuthController = require('../controllers/hubspot/OAuth')

router.get('/hubspotIntegration' , hubspotOAuthController.getAuth)
router.get('/hubspot-oauth-callback' , hubspotOAuthController.createAccessTokenFromHubspotCallback)

module.exports = router
