
exports.up = function(knex) {
  return knex.schema.createTable('candy', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.smallint('candyId').notNullable();
	  table.integer('amount').notNullable();
	  
	  table.primary(['userId', 'candyId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('candy');
};
