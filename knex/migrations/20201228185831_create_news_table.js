
exports.up = function(knex) {
  return knex.schema.createTable('news', function(table) {
	  table.increments();
	  table.string('title').notNullable();
	  table.string('body', 2000).notNullable();
	  table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('news');
};
