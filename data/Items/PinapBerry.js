const PlayerEncounters = require('~/knex/models/PlayerEncounters');
const { raw } = require('objection');
const ItemResponse = require('~/lib/ItemResponse');

class PinapBerry {
    constructor() {
        this.id = 9;
        this.name = 'Pinap Berry';
        this.searchName = 'pinapberry';
        this.plural = 'Pinap Berries';
        this.emoji = '<:pinapberry:794648205413449828>';
        this.description = 'Doubles the candy given if caught while under its effect.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 50;
        this.fromPokestop = true;
        this.fromGym = false;
        this.requiredLevel = 18;
        this.requiresEncounter = true;
        this.type = 'berry';
        this.weight = 10;
    }
    async use(msg, encounter) {
        encounter = await PlayerEncounters.query().updateAndFetchById(msg.userId, {
            item: this.id,
            candyEarned: raw('candyEarned * 2')
        })
        .where('userId', msg.userId);

        const itemResponse = new ItemResponse(true);
        itemResponse.setEncounter(encounter);

        return itemResponse;
    }
}

module.exports = new PinapBerry();