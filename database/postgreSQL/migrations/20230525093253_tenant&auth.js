/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    return knex.schema
        .createTable("rev_score_admin", (tbl) => {
            tbl.increments("tenantId").primary();
            tbl.text("email").unique();
            tbl.timestamps(true, true);
        })
        .createTable("third_party_auth", function (table) {
            table.increments("id").primary();
            table.integer("tenantId").unsigned();
            table.string("hubspot_access_token");
            table.string("hubspot_refresh_token");
            table.string("hubspot_expires_in");
            table.timestamps(true, true);

            table
                .foreign("tenantId")
                .references("tenantId")
                .inTable("rev_score_admin");
        })
        .createTable("users_under_tenant", (table) => {
            table.increments("id").primary();
            table.integer("tenantId");
            table.integer("userId").unique().primary();
            table.string("user_email").unique();
            table.timestamps(true , true)

            table
                .foreign("tenantId")
                .references("tenantId")
                .inTable("rev_score_admin");
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("third_party_auth")
        .dropTable("users_under_tenant")
        .dropTable("rev_score_admin");
};
