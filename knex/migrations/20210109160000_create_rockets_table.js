
exports.up = function(knex) {
  return knex.schema.createTable('rockets', function(table) {
	  table.increments('rocketId');
	  table.string('cell');
	  //type?
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('rockets');
};
