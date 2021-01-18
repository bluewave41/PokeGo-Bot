
exports.up = function(knex) {
  return knex.schema.createTable('team_listings', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.tinyint('teamId').references('teamId').inTable('player_teams').onDelete('cascade').notNullable();
	  table.integer('pokemonId').unsigned().references('pokemonId').inTable('pokemon').onDelete('cascade').notNullable();
	  table.tinyint('slot').notNullable();
	  
	  table.primary(['teamId', 'pokemonId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('team_listings');
};
