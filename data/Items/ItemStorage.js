const User = require('~/knex/models/User');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');

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
        this.fromGym = false;
        this.requiredLevel = 0;
        this.type = 'storage';
    }
    async buy(msg) {
        await User.query().increment('itemstorage', 50)
            .where('userId', msg.userId);

        await InventoryCommands.removeItems(msg.userId, this.id, 1);
    }
}

module.exports = new ItemStorage();