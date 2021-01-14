
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
	  table.bigint('lastMessageId');
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', function(table) {
	knex.dropColumn('lastMessageId');  
  })
};
