const { Model } = require('objection');
const Knex = require('knex');

const knex = Knex({
	client: 'mysql2',
	useNullAsDefault: true,
	connection: {
		database: 'pokegobot',
		user:     'root',
		password: '',
		supportBigNumbers: true,
	    bigNumberStrings: true,
	}
})

Model.knex(knex);