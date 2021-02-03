
exports.up = function(knex) {
  return knex.schema.table('player_encounters', function(table) {
	 table.tinyint('premierBalls').defaultsTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table('player_encounters', function(table) {
	 table.dropColumn('premierBalls'); 
  });
};
