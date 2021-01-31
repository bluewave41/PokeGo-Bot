
exports.up = function(knex) {
  return knex.schema.table('player_battles', function(table) {
	  table.tinyint('playerShields').defaultsTo(2);
	  table.tinyint('rocketShields').defaultsTo(2);
  })
};

exports.down = function(knex) {
  return knex.schema.table('player_battles', function(table) {
	  table.dropColumn('playerShields');
	  table.dropColumn('rocketShields');
  })
};
