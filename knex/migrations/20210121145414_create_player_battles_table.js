
exports.up = function(knex) {
  return knex.schema.createTable('player_battles', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').notNullable();
	  table.tinyint('teamId');
	  table.integer('rocketId').unsigned().references('rocketId').inTable('rockets').notNullable(); //need this to hide the rocket when battle done
	  table.integer('turnTimeout').notNullable();
	  
	  table.primary('userId');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('player_battles');
};
