
exports.up = function(knex) {
  return knex.schema.createTable('pokemon', function(table) {
	  table.integer('ownerId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.increments('pokemonId').notNullable();
	  table.smallint('pokedexId').notNullable();
	  table.string('nickname');
	  
	  table.smallint('hp').notNullable();
	  table.smallint('maxHP').notNullable();
	  table.smallint('atk').notNullable();
	  table.smallint('def').notNullable();
	  table.smallint('spatk').notNullable();
	  table.smallint('spdef').notNullable();
	  table.smallint('spd').notNullable();
	  
	  table.tinyint('hpiv').notNullable();
	  table.tinyint('atkiv').notNullable();
	  table.tinyint('defiv').notNullable();
	  table.tinyint('spatkiv').notNullable();
	  table.tinyint('spdefiv').notNullable();
	  table.tinyint('spdiv').notNullable();
	  
	  table.smallint('fastMove').notNullable();
	  table.smallint('chargeMove').notNullable();
	  
	  
	  table.tinyint('level').notNullable();
	  table.boolean('favorite').defaultTo(false);
	  table.boolean('shiny').notNullable();
	  
	  table.boolean('gender');
	  table.float('totaliv');
	  
  }).raw('ALTER TABLE pokemon AUTO_INCREMENT = 1');
};

exports.down = function(knex) {
  return knex.schema.dropTable('pokemon');
};
