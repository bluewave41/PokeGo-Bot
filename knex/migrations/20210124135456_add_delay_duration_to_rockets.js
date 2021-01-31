
exports.up = function(knex) {
  return knex.schema.table('rocket_pokemon', function(table) {
	  table.smallint('delay').defaultsTo(0);
  })
};

exports.down = function(knex) {
  return knex.schema.table('rocket_pokemon', function(table) {
	  table.dropColumn('delay');
  })
};
