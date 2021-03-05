const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const InventoryCommands = require('../data/ModelHandlers/InventoryCommands');
const Command = require('./Command');

const options = {
    names: ['inventory', 'inv'],
    expectedParameters: [],
}

class InventoryCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const inventory = await InventoryCommands.getItems(this.msg.userId);

        let description = '';
        let fields = [];
    
        if(inventory.length == 0) {
            description = 'You have no items.';
        }
        else {
            for(var i=0;i<inventory.length;i++) {
                let row = inventory[i];
                fields.push([row.item.emoji + ' ' + row.item.name, 'Count: ' + row.amount, false]);
            }
        }
    
        let embed = {
            title: 'Inventory',
            description: description,
            fields: fields,
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: InventoryCommand
}