
exports.up = function(knex) {
  return knex.schema.createTable('rockets', function(table) {
	  table.increments('rocketId');
	  table.string('cell').notNullable();
	  table.string('type').notNullable();
	  table.float('multiplier').defaultsTo(1).notNullable();
	  table.smallint('pokemon1').notNullable();
	  table.smallint('pokemon2').notNullable();
	  table.smallint('pokemon3').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('rockets');
};
