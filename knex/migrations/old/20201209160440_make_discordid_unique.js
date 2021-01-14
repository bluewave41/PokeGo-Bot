
exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
	  table.bigint('discordID').unique().alter();
  })
};

exports.down = function(knex) {
  
};
