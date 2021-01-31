
exports.up = function(knex) {
  return knex.schema.table('team_listings', function(table) {
	  table.boolean('active').defaultsTo(false).notNullable();
	  table.smallint('energy').defaultsTo(0);
  })
};

exports.down = function(knex) {
  return knex.schema.table('team_listings', function(table) {
	  table.dropColumn('active');
	  table.dropColumn('energy');
  })
};
