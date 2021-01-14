
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.smallint('secretId');
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.dropColumn('secretId');
  })
};
