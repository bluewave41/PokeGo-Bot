
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
	table.string('nextCommand');
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
	 table.dropColumn('nextCommand'); 
  });
};
