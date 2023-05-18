const router = require('express').Router()
const hubSpotRoutes = require('./Hubspot.routes')

router.use('/onboarding' , hubSpotRoutes)

module.exports = router