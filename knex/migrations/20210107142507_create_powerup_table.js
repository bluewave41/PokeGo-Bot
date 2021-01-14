
exports.up = function(knex) {
  return knex.schema.createTable('powerups', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.integer('pokemonId').unsigned().references('pokemonId').inTable('pokemon').onDelete('cascade').notNullable();
	  table.tinyint('maximum_times').notNullable();
	  table.tinyint('times').defaultsTo(1).notNullable();
	  table.smallint('required_candy').notNullable();
	  
	  table.primary('userId');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('powerups');
};
