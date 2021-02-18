
exports.up = function(knex) {
	return knex.schema.table('current_encounters', function(table) {
		table.string('cell', 3).notNullable().alter();
		table.tinyint('level').notNullable().alter();
		table.smallint('shinyId').notNullable().alter();
	});
};

exports.down = function(knex) {
  	return knex.schema.table('current_encounters', function(table) {
		table.string('cell', 255).alter();
		table.float('level').alter();
		table.integer('shinyId').alter();
	});
};
