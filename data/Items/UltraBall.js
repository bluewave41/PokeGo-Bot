class UltraBall {
    constructor() {
        this.id = 3;
        this.name = 'Ultra Ball';
        this.searchName = 'ultraball';
        this.plural = 'Ultra Balls';
        this.emoji = '<:ultraball:793190053957992488>';
        this.description = 'A greatly improved ball for catching Pokemon.';
        this.shopItem = true;
        this.price = 500;
        this.sellPrice = 250;
        this.fromPokestop = true;
        this.requiredLevel = 20;
        this.requiresEncounter = true;
        this.type = 'pokeball';
        this.catchMultiplier = 2;
    }
}

module.exports = new UltraBall();

//return { column: 'activePokeball', value: 3, flag: 'set' }