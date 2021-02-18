
exports.up = function(knex) {
	return knex.schema.table('users', function(table) {
		table.boolean('banned').defaultsTo(false).notNullable();
	})
};

exports.down = function(knex) {
	return knex.schema.table('users', function(table) {
		table.dropColumn('banned');
	})
};
