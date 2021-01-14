
exports.up = function(knex) {
 return knex.schema.createTable('current_encounters', function(table) {
	 table.string('cell').notNullable();
	 table.smallint('encounterId').notNullable().unique();
	 table.smallint('pokedexId').notNullable();
	 
	  //CP is generated when a user starts an encounter based on level
	 
	  table.float('level').notNullable();
	  table.smallint('hp').notNullable();
	  
	  table.tinyint('hpiv').notNullable();
	  table.tinyint('atkiv').notNullable();
	  table.tinyint('defiv').notNullable();
	  
	  table.smallint('fastMove').notNullable();
	  table.smallint('chargeMove').notNullable();
	
	  table.integer('shinyId').notNullable();
	  table.boolean('gender');
 })
};

exports.down = function(knex) {
  return knex.schema.dropTable('current_encounters');
};
