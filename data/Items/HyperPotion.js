class HyperPotion {
    constructor() {
        this.id = 12;
        this.name = 'Hyper Potion';
        this.searchName = 'hyperpotion';
        this.plural = 'Hyper Potions';
        this.emoji = '<:hyperpotion:795635140159602728>';
        this.description = 'Heals a Pokemon for 200 HP.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = true;
        this.requiredLevel = 15;
        this.requiresEncounter = false;
        this.type = 'healing';
    }
}

module.exports = new HyperPotion();