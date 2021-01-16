class PokeBall {
    constructor() {
        this.id = 1;
        this.name = 'Poke Ball';
        this.searchName = 'pokeball';
        this.plural = 'Poke Balls';
        this.emoji = '<:pokeball:793190053954060318>';
        this.description = 'A tool used for catching Pokemon';
        this.shopItem = true;
        this.price = 100;
        this.sellPrice = 50;
        this.fromPokestop = true;
        this.requiredLevel = 0;
        this.requiresEncounter = true;
        this.type = 'pokeball';
        this.catchMultiplier = 1;
    }
}

module.exports = new PokeBall();

//return { column: 'activePokeball', value: 1, flag: 'set' }