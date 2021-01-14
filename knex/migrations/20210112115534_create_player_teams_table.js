
exports.up = function(knex) {
  return knex.schema.createTable('player_teams', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.tinyint('teamId').notNullable();
	  table.string('name', 20);
	  table.integer('pokemon1');
	  table.integer('pokemon2');
	  table.integer('pokemon3');
	  
	  table.primary(['userId', 'teamId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('player_teams');
};
