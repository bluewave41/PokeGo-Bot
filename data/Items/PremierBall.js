class PremierBall {
    constructor() {
        this.id = 16;
        this.name = 'Premier Ball';
        this.searchName = 'premierball';
        this.plural = 'Premier Balls';
        this.emoji = '<:premierball:805528129976008704>';
        this.description = 'A tool used for catching Pokemon';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = false;
        this.requiredLevel = 0;
        this.requiresEncounter = true;
        this.type = 'pokeball';
        this.catchMultiplier = 1;
    }
}

module.exports = new PremierBall();