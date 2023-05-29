const rawContactPropertiesList = require('../../../helpers/hubspot/hubspotPropertiesListExtractedFromAPI.contacts.json')
const rawCompanyPropertiesList = require('../../../helpers/hubspot/hubspotPropertiesListExtractedFromAPI.companies.json')
const rawDealPropertiesList = require('../../../helpers/hubspot/hubspotPropertiesListExtractedFromAPI.deals.json')
let contactsPropertiesArray = rawContactPropertiesList.results.map((item) => item.name)
let companiesPropertiesArray = rawCompanyPropertiesList.results.map((item) => item.name)
let dealsPropertiesArray = rawDealPropertiesList.results.map((item) => item.name)
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return await knex.schema.createTable("hubspot_crm_contacts" , async (table) => {
    
    table.integer("userId")
    table.integer("tenantId")    
    table.timestamps( true , true )
    for(let column_name of contactsPropertiesArray){
      table.string(column_name)
    }


    table.foreign("userId").references("userId").inTable("users_under_tenant")
    table.foreign("tenantId").references("tenantId").inTable("rev_score_admin")
  }).createTable("hubspot_crm_companies" , async (table) => {
    table.integer("userId")
    table.integer("tenantId")    
    table.timestamps( true , true )
    for(let column_name of companiesPropertiesArray){
      table.string(column_name)
    }


    table.foreign("userId").references("userId").inTable("users_under_tenant")
    table.foreign("tenantId").references("tenantId").inTable("rev_score_admin")
  }).createTable("hubspot_crm_deals" , async (table) => {
    table.integer("userId")
    table.integer("tenantId")    
    table.timestamps( true , true )
    for(let column_name of dealsPropertiesArray){
      table.string(column_name)
    }


    table.foreign("userId").references("userId").inTable("users_under_tenant")
    table.foreign("tenantId").references("tenantId").inTable("rev_score_admin")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("hubspot_crm_contacts").dropTable("hubspot_crm_companies").dropTable("hubspot_crm_deals")
};
