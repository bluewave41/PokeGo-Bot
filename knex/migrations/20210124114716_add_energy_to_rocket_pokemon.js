
exports.up = function(knex) {
  return knex.schema.table('rocket_pokemon', function(table) {
	  table.smallint('energy').defaultsTo(0);
  })
};

exports.down = function(knex) {
  return knex.schema.table('rocket_pokemon', function(table) {
	  table.dropColumn('energy');
  })
};
