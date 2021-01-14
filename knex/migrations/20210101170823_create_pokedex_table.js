
exports.up = function(knex) {
  return knex.schema.createTable('pokedex', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.smallint('pokedexId').notNullable();
	  table.integer('seen').notNullable();
	  table.integer('caught').notNullable();
	  table.unique(['userId', 'pokedexId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('pokedex');
};
