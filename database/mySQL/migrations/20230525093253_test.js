/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  knex.schema.createTable("rev_score_admin" , tbl => {
    tbl.increments("userId" , true );
    tbl.text("email");
  })

//   knex.schema.createTable('third_party_auth', function (table) {
    
//     table.string('hubspot_access_token');
//     table.string('hubspot_refresh_token');
//     table.string('hubspot_expires_in');

//     table.foreign('hubspot_access_token').references('userId').inTable('rev_score_admin');
//     table.foreign('hubspot_refresh_token').references('userId').inTable('rev_score_admin');
//     table.foreign('hubspot_expires_in').references('userId').inTable('rev_score_admin');
//   });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
