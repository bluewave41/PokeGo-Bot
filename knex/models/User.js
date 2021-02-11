const { Model } = require('objection');

class User extends Model {
	static get tableName() {
		return 'users';
    }
    static get idColumn() {
        return 'userId';
    }

    static async reset(userId) {
        await this.query().update({
            nextCommand: null,
            saved: null
        })
        .where('userId', userId);
    }
    static async setNextCommand(userId, nextCommand) {
        await this.query().update({
            nextCommand: nextCommand
        })
        .where('userId', userId);
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
    static async getJSON(userId) {
        const user = await this.query().select('saved')
            .where('userId', userId)
            .first();
        return JSON.parse(user.saved); 
    }
    get json() {
        return JSON.parse(this.saved);
    }
}

module.exports = User;