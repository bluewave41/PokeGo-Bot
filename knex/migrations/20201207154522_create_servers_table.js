
exports.up = function(knex) {
  return knex.schema.createTable('servers', function(table) {
	table.bigint('serverId').primary().notNullable();
	table.string('prefix').notNullable();
	table.timestamp('created_at').defaultTo(knex.fn.now());
	table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('servers');
};
