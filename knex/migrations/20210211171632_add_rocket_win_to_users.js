
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.integer('rocketWinCount').defaultsTo(0).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.dropColumn('rocketWinCount');
  })
};
