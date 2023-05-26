const { table } = require("console");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return await knex.schema.createTable("hubspot_crm_contacts" , async (table) => {
    table.string("hs_id");
    table.integer("userId")
    table.integer("tenantId")
    table.dateTime("properties_createdate");
    table.string("properties_domain")
    table.dateTime("properties_hs_lastmodifieddate")
    table.string("properties_hs_object_id")
    table.string("properties_name")
    table.string("archived")
    table.dateTime("hs_createdAt")
    table.dateTime("hs_updatedAt")
    table.timestamps( true , true )

    table.foreign("userId").references("userId").inTable("users_under_tenant")
    table.foreign("tenantId").references("tenantId").inTable("rev_score_admin")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("hubspot_crm_contacts")
};
