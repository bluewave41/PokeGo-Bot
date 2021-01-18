
exports.up = function(knex) {
  return knex.schema.createTable('player_teams', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.tinyint('teamId').notNullable();
	  table.string('name', 20);
	  
	  table.primary(['teamId', 'userId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('player_teams');
};
