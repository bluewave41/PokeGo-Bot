const PlayerEncounters = require('~/knex/models/PlayerEncounters');
const ItemResponse = require('~/lib/ItemResponse');

class RazzBerry {
    constructor() {
        this.id = 7;
        this.name = 'Razz Berry';
        this.searchName = 'razzberry';
        this.plural = 'Razz Berries';
        this.emoji = '<:razzberry:794648206725349387>';
        this.description = 'Makes it easier to catch a Pokemon.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 50;
        this.fromPokestop = true;
        this.fromGym = false;
        this.requiredLevel = 8;
        this.requiresEncounter = true;
        this.type = 'berry';
        this.catchMultiplier = 1.5;
        this.weight = 10;
    }
    async use(msg, encounter) {
        encounter = await PlayerEncounters.query().updateAndFetchById(msg.userId, {
            item: this.id
        })
        .where('userId', msg.userId);

        const itemResponse = new ItemResponse(true);
        itemResponse.setEncounter(encounter);

        return itemResponse;

        await InventoryCommands.removeItems(msg.userId, this.id, 1);

        return encounter;
    }
}

module.exports = new RazzBerry();