class Potion {
    constructor() {
        this.id = 4;
        this.name = 'Potion';
        this.searchName = 'potion';
        this.plural = 'Potions';
        this.emoji = '<:potion:793189202404966440>';
        this.description = 'Heals a Pokemon for 20 HP.';
        this.shopItem = true;
        this.price = 50;
        this.sellPrice = 25;
        this.fromPokestop = true;
        this.requiredLevel = 5;
        this.requiresEncounter = false;
        this.type = 'healing';
    }
}

module.exports = new Potion();