class SuperPotion {
    constructor() {
        this.id = 11;
        this.name = 'Super Potion';
        this.searchName = 'superpotion';
        this.plural = 'Super Potions';
        this.emoji = '<:superpotion:795421463628873759>';
        this.description = 'Heals a Pokemon for 50 HP.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = true;
        this.requiredLevel = 10;
        this.requiresEncounter = false;
        this.type = 'healing';
    }
}

module.exports = new SuperPotion();