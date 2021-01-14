
exports.up = function(knex) {
    return knex.schema.table('encounters', function(table) {	
	  table.smallint('level').notNullable();
	  table.smallint('hp').notNullable();
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
	
	  table.integer('shinyId').notNullable();
	  	  
	  table.boolean('gender').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.table('encounters', function(table) {
	  table.dropColumn('level');
	  table.dropColumn('hp');
	  table.dropColumn('atk');
	  table.dropColumn('def');
	  table.dropColumn('spatk');
	  table.dropColumn('spdef');
	  table.dropColumn('spd');
	  table.dropColumn('hpiv');
	  table.dropColumn('defiv');
	  table.dropColumn('spatkiv');
	  table.dropColumn('spdefiv');
	  table.dropColumn('spdiv');
	  table.dropColumn('shinyId');
	  table.dropColumn('gender');
  })
};
