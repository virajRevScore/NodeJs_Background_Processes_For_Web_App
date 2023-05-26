/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('rev_score_admin').del()
  await knex('rev_score_admin').insert([
    { userId : 1 , email: 'testemail@gmail.com'},
    
  ]);
};
