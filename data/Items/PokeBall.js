const PlayerEncounters = require('~/knex/models/PlayerEncounters');

class PokeBall {
    constructor() {
        this.id = 1;
        this.name = 'Poke Ball';
        this.searchName = 'pokeball';
        this.plural = 'Poke Balls';
        this.emoji = '<:pokeball:793190053954060318>';
        this.description = 'A tool used for catching Pokemon';
        this.shopItem = true;
        this.price = 10;
        this.sellPrice = 5;
        this.fromPokestop = true;
        this.fromGym = false;
        this.requiredLevel = 0;
        this.requiresEncounter = true;
        this.type = 'pokeball';
        this.catchMultiplier = 1;
        this.weight = 50;
    }
    async use(msg, encounter) {
        encounter = await PlayerEncounters.query().updateAndFetchById(msg.userId, {
            activePokeball: 1
        })
        .where('userId', msg.userId);

        return encounter;
    }
}

module.exports = new PokeBall();

//return { column: 'activePokeball', value: 1, flag: 'set' }