const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv").config();
const uuid = require('uuid')
const routes = require("./routes/index");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const {MongoClient} = require('mongodb')
const  Arena  = require('bull-arena')
const bullMQ = require("bullmq");
const {Queue} = require("bullmq");
const { receiveWebhookRequest } = require("./controllers/hubspot/webhook");

require('./queues/hubspot/consumer.js')

const redisOptions = { host : "localhost" , port : 6379 }

global.hubspotETLQueue = new Queue("hubspotCRMQueue",  { connection : { host : "localhost" , port : 6379} });
const arena = Arena( {
  BullMQ : Queue,
  queues : [
    {
      type : 'bullmq',
      name : "hubspotCRMQueue",
      hostId : "server",
      redis : redisOptions
    }
  ]

} , 
  {
    basePath: '/arena',

    // Let express handle the listening.
    disableListen: true,
  }
)

const sessionStore = new session.MemoryStore() // not for prod . used only for dev env. need to figure out a session store for prod

const app = express();
// app.use('/', arena);

app.use(cookieParser())
app.use(
  session({
    
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
    store : sessionStore
  })
);


app.get("/", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.write(`<h2>HubSpot OAuth 2.0 Quickstart App</h2>`);

  res.end();
});

app.get("/error", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.write(`<h4>Error: ${req.query.msg}</h4>`);
  res.end();
});

// ---------Hubspopt Webhook ---------------------------------
app.post("/" , receiveWebhookRequest)
// ---------Hubspopt Webhook ---------------------------------

app.use("/api/v1/background_processes/", routes);

const PORT = process.env.PORT;
app.listen(PORT);
