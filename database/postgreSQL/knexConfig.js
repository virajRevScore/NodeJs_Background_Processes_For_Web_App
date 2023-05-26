const knex = require('knex')
const config = require("./knexfile")

const sqldb = knex(config.development)

  module.exports = { sqldb }