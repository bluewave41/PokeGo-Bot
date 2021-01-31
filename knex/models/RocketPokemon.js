const Pokemon = require('~/knex/models/Pokemon');

class RocketPokemon extends Pokemon {
	static get tableName() {
		return 'rocket_pokemon';
    }
}

module.exports = RocketPokemon;