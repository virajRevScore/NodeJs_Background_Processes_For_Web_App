// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

//  development : {
//     client: 'mysql',
//     connection: {
//       host : 'localhost',
//       port : 3306,
//       user : 'root',
//       password : '12345',
//       database : 'revscore',
//       // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
//     },
//     pool: { min: 0, max: 10 }
//   },

  development: {
    client: 'postgresql',
    connection: {
      database: 'revscore',
      user:     'postgres',
      password: '123'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
