
exports.up = function(knex) {
  return knex.schema.table('pokemon', function(table) {
	  table.float('totaliv');
  })
};

exports.down = function(knex) {
  return knex.schema.table('pokemon', function(table) {
	  table.dropColumn('totaliv');
  })
};
