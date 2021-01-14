
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.string('location').notNullable().defaultTo('x3');
  })
};

exports.down = function(knex) {
  	return knex.schema.table('pokemon', function(table) {
		table.dropColumn('location');
	});
};
