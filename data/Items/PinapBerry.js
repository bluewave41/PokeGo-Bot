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
        this.requiredLevel = 18;
        this.requiresEncounter = true;
        this.type = 'berry';
    }
}

module.exports = new  PinapBerry();

//return { column: 'candyEarned', type: 'multiply', value: 2 }