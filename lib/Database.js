const { Model } = require('objection');
const Knex = require('knex');

const knex = Knex({
	client: 'mysql2',
	useNullAsDefault: true,
	connection: {
		database: process.env.db,
		user:     process.env.username,
		password: process.env.password,
		supportBigNumbers: true,
	    bigNumberStrings: true,
	}
})

Model.knex(knex);