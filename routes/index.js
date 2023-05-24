const router = require('express').Router()
const hubSpotRoutes = require('./hubspot.routes')

router.use('/onboarding' , hubSpotRoutes)

module.exports = router