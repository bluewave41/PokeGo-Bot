
exports.up = function(knex) {
  return knex.schema.table('pokemon', function(table) {
	  table.boolean('shadow').defaultsTo(false);
  })
};

exports.down = function(knex) {
  return knex.schema.table('pokemon', function(table) {
	  table.dropColumn('shadow');
  })
};
