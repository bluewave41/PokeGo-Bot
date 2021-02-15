
exports.up = function(knex) {
  return knex.schema.table('pokestops', function(table) {
	  table.tinyint('type').notNullable();
  })
};

exports.down = function(knex) {
	return knex.schema.table('pokestops', function(table) {
		table.dropColumn('type');
	})
};
