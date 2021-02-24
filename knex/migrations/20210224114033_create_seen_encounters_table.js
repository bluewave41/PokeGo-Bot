
exports.up = function(knex) {
	return knex.schema.createTable('seen_encounters', function(table) {
		table.integer('userId').unsigned().references('userId').inTable('users').onDelete('cascade').notNullable();
		table.smallint('encounterId').notNullable();
		
		table.primary(['userId', 'encounterId']);
	})
};

exports.down = function(knex) {
	return knex.schema.dropTable('seen_encounters');
};
