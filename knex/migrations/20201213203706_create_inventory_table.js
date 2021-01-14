
exports.up = function(knex) {
  return knex.schema.createTable('inventory', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.smallint('itemId').notNullable();
	  table.smallint('amount').notNullable();
	  
	  table.primary(['userId', 'itemId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('inventory');
};
