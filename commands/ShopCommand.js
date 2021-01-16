const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const User = require('~/knex/models/User');
const ItemHandler = require('~/lib/ItemHandler');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const EmojiList = require('~/data/Lists/EmojiList');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const CustomError = require('~/lib/errors/CustomError');

const options = {
    names: ['shop'],
    expectedParameters: [
        { name: 'action', type: 'string', optional: true, default: 'list', isDefined: [
            { name: 'name', type: 'rest', ofType: 'string', separator: '', optional: false },
            { name: 'amount', type: 'number', optional: true, default: 1 }
        ]}
    ]
}

class ShopCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        let embed = {
            title: 'Shop',
            description: '',
            fields: [],
        }

        const user = await User.query().select('level', 'currency')
            .where('userId', this.msg.userId).first();

        let item;

        switch(this.action) {
            case 'list':
                const items = ItemHandler.getItemsInShop(user.level);

                embed.description = "Welcome! What would you like to buy?";
                for(var i=0;i<items.length;i++) {
                    let item = items[i];
                    embed.fields.push([item.name, `${item.emoji}\n${item.description}\n**${item.price}₽**`, false]);
                }
                embed.footer = `You have ${user.currency}₽.`;
                break;
            case 'buy':
                console.log(this.name)
                item = ItemHandler.getItem(this.name);
                canBuyItem(user.currency, item, this.amount);
                //we can buy the item

                if(typeof item.buy === 'function') { //run this instead of adding item to inventory
                    await item.buy(this.msg.userId);
                }
                else {
                    //add item to inv
                    await InventoryCommands.addItems(this.msg.userId, item.id, this.amount);
                }
                await UserCommands.removeCurrency(this.msg.userId, item.price * this.amount);

                embed.description = `You bought ${this.amount} ${this.amount == 1 ? item.name : item.plural} for ${item.price*this.amount} ${EmojiList.COIN}!`;
                embed.footer = `You now have: ${user.currency - item.price * this.amount}₽.`
                break;
            case 'sell':
                item = ItemHandler.getItem(this.name);
                const { amount: itemCount } = await InventoryCommands.getItemCount(this.msg.userId, item.id);

                canSellItems(itemCount, this.amount);
        
                await InventoryCommands.removeItems(this.msg.userId, item.id, this.amount);
                await UserCommands.addCurrency(this.msg.userId, item.sellPrice * this.amount);
        
                embed.description = `You sold ${this.amount} ${this.amount == 1 ? item.name : item.plural} for ${item.sellPrice * this.amount} ${EmojiList.COIN}.`;
                embed.footer = `You now have: ${user.currency + item.sellPrice * this.amount}₽.`
                break;
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: ShopCommand,
}

function canBuyItem(currency, item, amount) {
    if(currency < item.price * amount) {
        throw new CustomError('INSUFFICIENT_CURRENCY');
    }
    return true;
}

function canSellItems(itemCount, amount) {
    if(itemCount < amount) {
        throw new CustomError('NOT_ENOUGH_ITEMS');
    }
}