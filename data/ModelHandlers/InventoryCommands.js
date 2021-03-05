const { UniqueViolationError } = require('objection');
const Inventory = require('~/knex/models/Inventory');
const Items = require('~/data/Lists/ItemList');

module.exports = {
    async getItemCount(userId, itemId) {
        let row = await Inventory.query().select('amount')
            .where('userId', userId)
            .where('itemId', itemId)
            .first();

        return row ? row.amount : 0;
    },
    async removeItems(userId, itemId, amount) {
        let r = await Inventory.query().decrement('amount', amount)
            .where('userId', userId)
            .where('itemId', itemId);
    },
    async addItems(userId, itemId, amount) {
        try {
            await Inventory.query().insert({
                userId: userId,
                itemId: itemId,
                amount: amount
            });
        }
        catch(err) {
            if(err instanceof UniqueViolationError) {
                await Inventory.query().increment('amount', amount)
                .where('userId', userId)
                .where('itemId', itemId);
            }
        }
    },
    async getTotalItemCount(userId) {
        const inventory = await Inventory.query().sum('amount as sum')
            .where('userId', userId);

        return inventory[0].sum || 0;
    },
    /**
     * Returns the items a user has.
     * @param {*} userId userId 
     * @param {Array} items Array of items to filter out otherwise returns all items
     * @returns 
     */
    async getItems(userId, items) {
        const inventory = Inventory.query().select('itemId', 'amount')
            .where('userId', userId)
            .whereNot('amount', 0);

        if(items) { //if we specified items filter them only
            inventory.whereIn('itemId', items)
        }

        return await inventory;
    },
}