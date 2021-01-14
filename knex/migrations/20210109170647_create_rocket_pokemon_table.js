
exports.up = function(knex) {
  return knex.schema.createTable('rocket_pokemon', function(table) {
	  table.integer('rocketId').unsigned().references('rocketId').inTable('rockets').onDelete('cascade').notNullable();
	  
	  table.smallint('pokedexId').notNullable();
	  
	  table.smallint('cp').notNullable();
	  table.smallint('hp').notNullable();
	  
	  table.tinyint('hpiv').notNullable();
	  table.tinyint('atkiv').notNullable();
	  table.tinyint('defiv').notNullable();
	  
	  table.smallint('fastMove').notNullable();
	  table.smallint('chargeMove').notNullable();
	  
	  
	  table.float('level').notNullable();
	  table.boolean('gender');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('rocket_pokemon');
};
