class NanabBerry {
    constructor() {
        this.id = 8;
        this.name = 'Nanab Berry';
        this.searchName = 'nanabberry';
        this.plural = 'Nanab Berries';
        this.emoji = '<:nanabberry:794648204070486056>';
        this.description = 'Stops a Pokemon from moving for 1 turn.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 50;
        this.fromPokestop = true;
        this.requiredLevel = 14;
        this.requiresEncounter = true;
        this.type = 'berry';
    }
}

module.exports = new NanabBerry();

//return { column: 'canPokemonMove', flag: 'set', value: false }