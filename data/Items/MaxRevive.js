class MaxRevive {
    constructor() {
        this.id = 13;
        this.name = 'Max Revive';
        this.searchName = 'maxrevive';
        this.plural = 'Max Revives';
        this.emoji = '<:maxrevive:795635140218978304>';
        this.description = 'Revives a Pokemon from being fainted with full HP.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = true;
        this.requiredLevel = 30;
        this.requiresEncounter = false;
        this.type = 'revive';
    }
}

module.exports = new MaxRevive();