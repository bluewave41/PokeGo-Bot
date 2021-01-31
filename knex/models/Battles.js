const { Model } = require('objection');
const RocketPokemon = require('~/knex/models/RocketPokemon');

class Battles extends Model {
	static get tableName() {
		return 'player_battles';
    }
    static get relationMappings() {
        const Teams = require('./Teams');
        
        return {
            playerTeam: {
                relation: Model.HasOneRelation,
                modelClass: Teams,
                join: {
                    from: 'player_battles.teamId',
                    to: 'player_teams.teamId',
                }
            },
            rocketTeam: {
                relation: Model.HasManyRelation,
                modelClass: RocketPokemon,
                join: {
                    from: 'player_battles.userId',
                    to: 'rocket_pokemon.userId'
                }
            }
        }
    }
}

module.exports = Battles;