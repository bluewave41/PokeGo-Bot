
exports.up = function(knex) {
  return knex.schema.table('team_listings', function(table) {
	  table.smallint('delay').defaultsTo(0);
  })
};

exports.down = function(knex) {
  return knex.schema.table('team_listings', function(table) {
	  table.dropColumn('delay');
  })
};
