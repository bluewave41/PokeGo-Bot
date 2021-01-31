
exports.up = function(knex) {
  return knex.schema.table('player_battles', function(table) {
	  table.boolean('firstTurn').defaultsTo(true);
  })
};

exports.down = function(knex) {
  return knex.schema.table('player_battles', function(table) {
	  table.dropColumn('firstTurn');
  })
};
