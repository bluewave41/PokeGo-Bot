const PlayerEncounters = require('~/knex/models/PlayerEncounters');
const ItemResponse = require('~/lib/ItemResponse');

class NanabBerry {
    constructor() {
        this.id = 8;
        this.name = 'Nanab Berry';
        this.searchName = 'nanabberry';
        this.plural = 'Nanab Berries';
        this.emoji = '<:nanabberry:794648204070486056>';
        this.description = 'Stops a Pokemon from moving for 1 turn.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 50;
        this.fromPokestop = true;
        this.fromGym = false;
        this.requiredLevel = 14;
        this.requiresEncounter = true;
        this.type = 'berry';
        this.weight = 5;
    }
    async use(msg, encounter) {
        encounter = await PlayerEncounters.query().updateAndFetchById(msg.userId, {
            item: this.id,
            canPokemonMove: false
        })
        .where('userId', msg.userId);

        const itemResponse = new ItemResponse(true);
        itemResponse.setEncounter(encounter);

        return itemResponse;
    }
}

module.exports = new NanabBerry();