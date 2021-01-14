const { Model } = require('objection');
const items = require('~/data/Lists/ItemList').items;

class Inventory extends Model {
	static get tableName() {
		return 'inventory';
    }
    static get virtualAttributes() {
        return ['emoji', 'name'];
    }
    static get modifiers() {
        return {
            pokeballs(builder) {
                return builder.where('itemId', '=', )
            }
        }
    }
    get emoji() {
        return items.find(el => el.id == this.itemId).emoji;
    }
    get name() {
        return items.find(el => el.id == this.itemId).name;
    }
}

module.exports = Inventory;