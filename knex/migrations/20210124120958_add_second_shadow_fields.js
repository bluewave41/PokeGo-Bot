
exports.up = function(knex) {
   return knex.schema.table('rocket_pokemon', function(table) {
	  table.boolean('shadow').defaultsTo(true);
  })
};

exports.down = function(knex) {
   return knex.schema.table('rocket_pokemon', function(table) {
	  table.dropColumn('shadow');
  })
};
