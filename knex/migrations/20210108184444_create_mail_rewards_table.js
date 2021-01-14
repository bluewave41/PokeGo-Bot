
exports.up = function(knex) {
  return knex.schema.createTable('mail_rewards', function(table) {
	  table.integer('mailId').unsigned().references('id').inTable('mail').onDelete('cascade').notNullable();
	  table.integer('itemId').notNullable();
	  table.smallint('amount').notNullable();
	  table.primary(['mailId', 'itemId']);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('mail_rewards');
};
