
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.json('saved');
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.dropColumn('users');
  })
};
