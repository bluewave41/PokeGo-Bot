class Revive {
    constructor() {
        this.id = 10;
        this.name = 'Revive';
        this.searchName = 'revive';
        this.plural = 'Revives';
        this.emoji = '<:revive:795413532791144518>';
        this.description = 'Revives a Pokemon from being fainted with half HP.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = true;
        this.requiredLevel = 5;
        this.requiresEncounter = false;
        this.type = 'revive';
    }
}

module.exports = new Revive();