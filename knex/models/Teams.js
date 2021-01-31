const { Model } = require('objection');

class Teams extends Model {
	static get tableName() {
		return 'player_teams';
    }
    static get relationMappings() {
        const Pokemon = require('./Pokemon');

        return {
			pokemon: {
                relation: Model.ManyToManyRelation,
                modelClass: Pokemon,
                join: {
                    from: 'player_teams.teamId',
                    through: {
                        from: 'team_listings.teamId',
                        to: 'team_listings.pokemonId',
                        extra: ['slot', 'active', 'energy', 'delay'],
                    },
                    to: 'pokemon.pokemonId'
                }
			}
        }
    }
}

module.exports = Teams;