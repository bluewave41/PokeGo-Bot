const PlayerEncounters = require(`~/knex/models/PlayerEncounters`);
const ItemResponse = require('~/lib/ItemResponse');

class GreatBall {
    constructor() {
        this.id = 2;
        this.name = 'Great Ball';
        this.searchName = 'greatball';
        this.plural = 'Great Balls';
        this.emoji = '<:greatball:793190054003998720>';
        this.description = 'An improved ball for catching Pokemon';
        this.shopItem = true;
        this.price = 200;
        this.sellPrice = 100;
        this.fromPokestop = true;
        this.fromGym = false;
        this.requiredLevel = 12;
        this.requiresEncounter = true;
        this.type = 'pokeball';
        this.catchMultiplier = 1.5;
        this.weight = 15;
    }
    async use(msg, encounter) {
        encounter = await PlayerEncounters.query().updateAndFetchById(msg.userId, {
            activePokeball: 2
        })
        .where('userId', msg.userId);

        const itemResponse = new ItemResponse(false);
        itemResponse.setEncounter(encounter);
        
        return itemResponse;
    }
}

module.exports = new GreatBall();