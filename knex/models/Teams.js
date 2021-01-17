const { Model } = require('objection');

class Teams extends Model {
	static get tableName() {
		return 'player_teams';
    }
    static get relationMappings() {
        const Pokemon = require('./Pokemon');

        return {
            p1: {
                relation: Model.HasOneRelation,
                modelClass: Pokemon,
                join: {
                    from: 'player_teams.pokemon1',
                    to: 'pokemon.pokemonId'
                }
            },
            p2: {
                relation: Model.HasOneRelation,
                modelClass: Pokemon,
                join: {
                    from: 'player_teams.pokemon2',
                    to: 'pokemon.pokemonId'
                }
            },
            p3: {
                relation: Model.HasOneRelation,
                modelClass: Pokemon,
                join: {
                    from: 'player_teams.pokemon3',
                    to: 'pokemon.pokemonId'
                }
            }
        }
    }
}

module.exports = Teams;