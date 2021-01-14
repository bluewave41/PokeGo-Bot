
exports.up = function(knex) {
  return knex.schema.createTable('player_encounters', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.smallint('encounterId').unsigned().notNullable();
	  table.tinyint('pokemonPos').defaultsTo(1).notNullable();
	  table.tinyint('item').defaultsTo(null);
	  table.tinyint('candyEarned').notNullable().defaultsTo(3);
	  table.float('medalMultiplier').notNullable();
	  table.tinyint('activePokeball').notNullable().defaultsTo(1);
	  table.boolean('canPokemonMove').notNullable().defaultsTo(true);
	  
	  table.string('cell').notNullable();
	  table.smallint('pokedexId').notNullable();
	 
	  table.smallint('cp').notNullable();
	 
	  table.float('level').notNullable();
	  table.smallint('hp').notNullable();
	  
	  table.tinyint('hpiv').notNullable();
	  table.tinyint('atkiv').notNullable();
	  table.tinyint('defiv').notNullable();
	  
	  table.smallint('fastMove').notNullable();
	  table.smallint('chargeMove').notNullable();
	
	  table.boolean('shiny').notNullable();
	  table.boolean('gender');
	  
	  table.primary(['userId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('player_encounters');
};
