const { isThisSecond } = require("date-fns");

class RazzBerry {
    constructor() {
        this.id = 7;
        this.name = 'Razz Berry';
        this.searchName = 'razzberry';
        this.plural = 'Razz Berries';
        this.emoji = '<:razzberry:794648206725349387>';
        this.description = 'Makes it easier to catch a Pokemon.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 50;
        this.fromPokestop = true;
        this.requiredLevel = 8;
        this.requiresEncounter = true;
        this.type = 'berry';
        this.catchMultiplier = 1.5;
    }
}

module.exports = new RazzBerry();