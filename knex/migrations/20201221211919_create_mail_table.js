
exports.up = function(knex) {
  return knex.schema.createTable('mail', function(table) {
	  table.increments();
	  table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
	  table.string('title').notNullable();
	  table.string('message').notNullable();
	  table.boolean('read').defaultsTo(false);
	  table.boolean('claimedrewards').defaultsTo(false);
	  table.unique(['userId', 'title']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('mail');
};
