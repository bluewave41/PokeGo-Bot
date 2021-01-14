
exports.up = function(knex) {
  return knex.schema.createTable('travel_requests', function(table) {
	 table.integer('userId').primary().unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	 table.string('location');
	 table.timestamp('end_time').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('travel_requests');
};
