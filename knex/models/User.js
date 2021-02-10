const { Model } = require('objection');

class User extends Model {
	static get tableName() {
		return 'users';
    }
    static get idColumn() {
        return 'userId';
    }
	
	static get relationMappings() {
        const Pokemon = require('./Pokemon');
        const PlayerEncounters = require('./PlayerEncounters');
        const Inventory = require('./Inventory');
        const Medals = require('./Medals');
		
		return {
			pokemon: {
				relation: Model.HasManyRelation,
				modelClass: Pokemon,
				join: {
					from: 'users.userId',
					to: 'pokemon.ownerId'
				}
            },
            encounter: {
                relation: Model.HasOneRelation,
                modelClass: PlayerEncounters,
                join: {
                    from: 'users.userId',
                    to: 'player_encounters.userId'
                }
            },
            inventory: {
                relation: Model.HasManyRelation,
                modelClass: Inventory,
                join: {
                    from: 'users.userId',
                    to: 'inventory.userId'
                }
            },
            medals: {
                relation: Model.HasManyRelation,
                modelClass: Medals,
                join: {
                    from: 'users.userId',
                    to: 'medals.userId'
                }
            }
		}
    }
}

module.exports = User;