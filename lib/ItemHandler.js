const CustomError = require('./errors/CustomError');
const Items = require('~/data/Lists/ItemList');

class ItemCollection {
    constructor() {
        this.pokestopItems = [];
        this.gymItems = [];
        this.pokestopWeights = 0;
        this.gymWeights = 0;
        this.init();
    }
    init() {
        for(var i=0;i<Items.length;i++) {
            let item = Items[i];
            if(item.fromPokestop) {
                this.pokestopWeights += item.weight;
                item.accumulatedWeight = this.pokestopWeights;
                this.pokestopItems.push(item);
            }
            else if(Items[i].fromGym) {
                this.gymWeights += item.weight;
                item.accumulatedWeight = this.gymWeights;
                this.gymItems.push(item);
            }
        }
    }
    getPokestopItems(level) {
        const numberOfItems = Math.floor(Math.random() * 3) + 3; //3-5
        const validItems = this.pokestopItems.filter(el => el.requiredLevel < level);
        let items = [];
        for(var i=0;i<numberOfItems;i++) {
            const random = Math.random() * this.pokestopWeights;
            for(var j=0;j<validItems.length;j++) {
                if(validItems[j].accumulatedWeight >= random) {
                    items.push(validItems[j]);
                    break;
                }
            }
        }
        return items;
    }
    getGymItems(level) {
        const numberOfItems = Math.floor(Math.random() * 3) + 3; //3-5
        const validItems = this.gymItems.filter(el => el.requiredLevel < level);
        let items = [];
        for(var i=0;i<numberOfItems;i++) {
            const random = Math.random() * this.gymWeights;
            for(var j=0;j<validItems.length;j++) {
                if(validItems[j].accumulatedWeight >= random) {
                    items.push(validItems[j]);
                    break;
                }
            }
        }
        return items;
    }
    getItem(itemToFind) {
        if(!itemToFind) {
            return null;
        }
        let item;
        if(Number.isInteger(parseInt(itemToFind))) {
            item = Items.find(el => el.id == itemToFind);
        }
        else {
            item = Items.find(el => el.searchName.toLowerCase().includes(itemToFind.toLowerCase()));
        }
        if(!item) {
            throw new CustomError('NO_ITEM_EXISTS', itemToFind);
        }
        return item;
    }
    getItemsInShop(level) {
        return Items.filter(el => el.shopItem && el.requiredLevel <= level);
    }
}

module.exports = new ItemCollection();