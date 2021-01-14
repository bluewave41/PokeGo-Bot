
exports.up = function(knex) {
  return knex.schema.table('pokemon', function(table) {
	  table.tinyint('level').notNullable();
  })
};

exports.down = function(knex) {
	return knex.schema.table('pokemon', function(table) {
		table.dropColumn('level');
	});
};
