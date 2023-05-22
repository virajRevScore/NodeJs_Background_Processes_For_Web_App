const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoDB = require("mongodb");
require("dotenv").config();
let con;

async function connect(service) {
  if (con) return con; // return connection if already conncted
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  con = client.connect();
  return con;
}
module.exports = {con , connect}