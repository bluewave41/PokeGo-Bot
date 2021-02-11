const Command = require('./Command');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const ItemHandler = require('~/lib/ItemHandler');
const CustomError = require('~/lib/errors/CustomError');

const options = {
    names: ['giveItem'],
    expectedParameters: [
        { name: 'item', type: ['number', 'string'], optional: false },
        { name: 'amount', type: 'number', optional: true, default: 1 }
    ],
    ownerOnly: true,
}

class GiveItemCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        if(typeof this.item === 'string') {
            const item = ItemHandler.getItem(this.item);
            if(item) {
                await InventoryCommands.addItems(this.msg.userId, item.id, this.amount);
            }
            else {
                throw new CustomError('NO_ITEM_EXISTS', this.item);
            }
        }
        else {
            await InventoryCommands.addItems(this.msg.userId, this.itemId, this.amount);
        }

        const embed = {
            title: 'Added Items',
            description: 'Requested items were added to your profile.'
        }

        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: GiveItemCommand
}