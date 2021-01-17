class MaxPotion {
    constructor() {
        this.id = 14;
        this.name = 'Max Potion';
        this.searchName = 'maxpotion';
        this.plural = 'Max Potions';
        this.emoji = '<:maxpotion:795636999520124928>';
        this.description = 'Heals a Pokemon to full HP.';
        this.shopItem = false;
        this.price = 700;
        this.sellPrice = 350;
        this.fromPokestop = true;
        this.requiredLevel = 30;
        this.requiresEncounter = false;
        this.type = 'healing';
    }
}

module.exports = new MaxPotion();