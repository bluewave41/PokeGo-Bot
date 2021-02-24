const { UniqueViolationError } = require('objection');
const Inventory = require('~/knex/models/Inventory');

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
        console.log(r);
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
    async getInventory(userId) {
        const inventory = await Inventory.query().select('itemId', 'amount')
            .where('userId', userId)
            .whereNot('amount', 0);
        return inventory;
    },
    async getPokeballs(userId) {
        const inventory = await Inventory.query().select('itemId', 'amount')
            .where('userId', userId)
            .whereIn('itemId', [1, 2, 3])
            .whereNot('amount', 0);

        return inventory;
    }
}