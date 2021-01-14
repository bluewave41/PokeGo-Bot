
exports.up = function(knex) {
  return knex.schema.table('pokemon', function(table) {
	  table.smallint('maxHP').notNullable();
  })
};

exports.down = function(knex) {
  	return knex.schema.table('pokemon', function(table) {
		table.dropColumn('maxHP');
	});
};
