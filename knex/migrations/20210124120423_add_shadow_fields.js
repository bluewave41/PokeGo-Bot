
exports.up = function(knex) {
	return Promise.all([
		knex.schema.table('pokemon', function(table) {
			table.boolean('shadow').defaultsTo(false);
		}),
		knex.schema.table('player_encounters', function(table) {
			table.boolean('shadow').defaultsTo(false);
		})
	]);
};

exports.down = function(knex) {
  	return Promise.all([
		knex.schema.table('pokemon', function(table) {
			table.dropColumn('shadow');
		}),
		knex.schema.table('player_encounters', function(table) {
			table.dropColumn('shadow');
		})
	]);
};