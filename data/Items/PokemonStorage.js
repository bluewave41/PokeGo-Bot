const User = require('~/knex/models/User');

class PokemonStorage {
    constructor() {
        this.id = 5;
        this.name = 'Pokemon Storage';
        this.searchName = 'pokemonstorage';
        this.plural = 'Pokemon Storage';
        this.emoji = '<:pokemonstorage:726077103975432243>';
        this.description = 'Increases your Pokemon Storage by 50 slots.';
        this.shopItem = true;
        this.price = 500;
        this.sellPrice = 0;
        this.fromPokestop = false;
        this.requiredLevel = 0;
        this.type = 'storage';
    }
    async buy(userId) {
        await User.query().increment('storage', 50)
            .where('userId', userId);
    }
}

module.exports = new PokemonStorage();