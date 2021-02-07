
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.tinyint('page').defaultsTo(0);
	  table.tinyint('maxPage').defaultsTo(0);
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.dropColumn('page');
	  table.dropColumn('maxPage');
  })
};
