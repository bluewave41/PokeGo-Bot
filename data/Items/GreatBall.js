const PlayerEncounters = require(`~/knex/models/PlayerEncounters`);

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
        this.requiredLevel = 12;
        this.requiresEncounter = true;
        this.type = 'pokeball';
        this.catchMultiplier = 1.5;
    }
    async use(userId) {
        await PlayerEncounters.query().update({
            activePokeball: 2
        })
        .where('userId', userId);
    }
}

module.exports = new GreatBall();

//return { column: 'activePokeball', value: 2, flag: 'set' }