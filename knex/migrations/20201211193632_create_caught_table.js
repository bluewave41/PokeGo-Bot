
exports.up = function(knex) {
  return knex.schema.createTable('caught', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.integer('encounterId').notNullable();
	  
	  table.primary(['userId', 'encounterId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('caught');
};
