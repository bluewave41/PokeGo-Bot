
exports.up = function(knex) {
  return knex.schema.table('pokemon', function(table) {
	  table.boolean('favorite').defaultTo(false);
  })
};

exports.down = function(knex) {
  	return knex.schema.table('pokemon', function(table) {
		table.dropColumn('favorite');
	});
};
