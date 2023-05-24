const receiveWebhookRequest = async ( req , res ) => {
    console.log("got some shit via webshook")
    res.json({body : req.body})
}

module.exports = { receiveWebhookRequest }