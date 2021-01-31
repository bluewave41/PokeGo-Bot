const { Model } = require('objection');

class Rockets extends Model {
	static get tableName() {
		return 'rockets';
    }
    static get relationMappings() {
        const RocketPokemon = require('./RocketPokemon');
        return {
            pokemon: {
                relation: Model.HasManyRelation,
                modelClass: RocketPokemon,
                join: {
                    from: 'rockets.rocketId',
                    to: 'rocket_pokemon.rocketId'
                }
            }
        }
    }
}

module.exports = Rockets;