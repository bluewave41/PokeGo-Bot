const UserCommands = require('~/data/ModelHandlers/UserCommands');

class ItemStorage {
    constructor() {
        this.id = 6;
        this.name = 'Item Storage';
        this.searchName = 'itemstorage';
        this.plural = 'Item Storage';
        this.emoji = '<:bagupgrade:794287709665099780>';
        this.description = "Increases your Bag Storage by 50 slots.";
        this.shopItem = true;
        this.price = 500;
        this.sellPrice = 0;
        this.fromPokestop = false;
        this.requiredLevel = 0;
        this.type = 'storage';
    }
    async buy(userId) {
        await UserCommands.update(userId, [
            { rowName: 'itemstorage', value: 50, flag: 'increment' }
        ]);
    }
}

module.exports = new ItemStorage();