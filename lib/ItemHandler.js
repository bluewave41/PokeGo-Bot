const CustomError = require('./errors/CustomError');
const Items = require('~/data/Lists/ItemList').items;

module.exports = {
    getPokestopItems(level) {
        return Items.filter(el => el.fromPokestop && el.requiredLevel <= level);
    },
    getItem(itemToFind) {
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
    },
    getItemsInShop(level) {
        return Items.filter(el => el.shopItem && el.requiredLevel <= level);
    },
}