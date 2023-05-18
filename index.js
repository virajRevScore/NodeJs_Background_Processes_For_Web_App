const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv").config();
const routes = require("../routes/index");

const app = express();

app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
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

app.use("/api/v1/background_processes/", routes);

const PORT = process.env.PORT;
app.listen(PORT);
