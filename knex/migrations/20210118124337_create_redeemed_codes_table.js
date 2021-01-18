
exports.up = function(knex) {
  return knex.schema.createTable('redeemed_codes', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.string('redeemId').references('redeemId').inTable('redeemcodes').onDelete('cascade').notNullable();
	  table.primary(['userId', 'redeemId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('redeemed_codes');
};
