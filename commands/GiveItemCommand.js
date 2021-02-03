const Command = require('./Command');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

const options = {
    names: ['giveItem'],
    expectedParameters: [
        { name: 'itemId', type: 'number', optional: false },
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
        await InventoryCommands.addItems(this.msg.userId, this.itemId, this.amount);

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