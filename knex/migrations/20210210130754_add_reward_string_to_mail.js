
exports.up = function(knex) {
  return knex.schema.table('mail', function(table) {
	table.string('rewardString', 100);
  });
};

exports.down = function(knex) {
  return knex.schema.table('mail', function(table) {
	  table.dropColumn('rewardString');
  })
};
