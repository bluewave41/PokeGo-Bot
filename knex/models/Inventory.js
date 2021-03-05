const { Model } = require('objection');
const ItemList = require('~/data/Lists/ItemList');

class Inventory extends Model {
	static get tableName() {
		return 'inventory';
    }

    async $afterFind(queryContext) {
        this.item = ItemList.find(el => el.id == this.itemId);
    }
}

module.exports = Inventory;