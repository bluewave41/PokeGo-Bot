
exports.up = function(knex) {
  return knex.schema.createTable('spun_pokestops', function(table) {
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.integer('pokestopId').unsigned().references('id').inTable('pokestops').onDelete('cascade').notNullable();
	  table.timestamp('endTime').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('spun_pokestops');
};
