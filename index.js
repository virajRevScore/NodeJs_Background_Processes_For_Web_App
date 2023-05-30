const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv").config();
const uuid = require("uuid");
const routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const Arena = require("bull-arena");
const bullMQ = require("bullmq");
const { Queue } = require("bullmq");
const { receiveWebhookRequest } = require("./controllers/hubspot/webhook");
const bodyParser = require("body-parser");
const { sqldb } = require('./database/postgreSQL/knexConfig')
console.log(sqldb)

require("./queues/hubspot/consumer.js");

const redisOptions = { host: "localhost", port: 6379 };

// global.hubspotETLQueue = new Queue("hubspotCRMQueue", {
//     connection: { host: "localhost", port: 6379 },
// });   maybe not needed as worker for queue has been imported above
const { QueueEvents } = require('bullmq')

const queueEventsStage1 = new QueueEvents('hubspotCRMQueueStage1' , {connection : redisOptions});
const queueEventsStage2 = new QueueEvents('hubspotCRMQueueStage2' , {connection : redisOptions});

queueEventsStage1.on('completed', ({jobId}) => {
  console.log("commpleted" +  jobId)
});
queueEventsStage2.on('completed', ({jobId}) => {
  console.log("commpleted222222 ------------------>>>>>>yayyyyyyy" +  jobId)
});


const arena = Arena(
    {
        BullMQ: Queue,
        queues: [
            {
                type: "bullmq",
                name: "hubspotCRMQueue",
                hostId: "server",
                redis: redisOptions,
            },
        ],
    },
    {
        basePath: "/arena",

        // Let express handle the listening.
        disableListen: true,
    }
);

const sessionStore = new session.MemoryStore(); // not for prod . used only for dev env. need to figure out a session store for prod

const app = express();
// app.use('/', arena);

app.use(cookieParser());
app.use(
    session({
        secret: Math.random().toString(36).substring(2),
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
app.post("/", receiveWebhookRequest);
// ---------Hubspopt Webhook ---------------------------------

app.use("/api/v1/background_processes/", routes);

const PORT = process.env.PORT;
app.listen(PORT);
