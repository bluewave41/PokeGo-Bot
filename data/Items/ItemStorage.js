const User = require('~/knex/models/User');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const ItemResponse = require('~/lib/ItemResponse');

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

        return new ItemResponse(true);
    }
}

module.exports = new ItemStorage();