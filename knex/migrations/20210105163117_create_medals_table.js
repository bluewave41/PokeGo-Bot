
exports.up = function(knex) {
  return knex.schema.createTable('medals', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.smallint('medalId').notNullable();
	  table.smallint('amount').notNullable();
	  table.unique(['userId', 'medalId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('medals');
};
