
exports.up = function(knex) {
  return knex.schema.createTable('pokestops', function(table) {
	  table.increments('id');
	  table.string('cell');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('pokestops');
};
