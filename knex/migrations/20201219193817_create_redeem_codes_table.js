
exports.up = function(knex) {
  return knex.schema.createTable('redeemcodes', function(table) {
	  table.string('redeemId').primary().notNullable();
	  table.json('rewards').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('redeemcodes');
};
