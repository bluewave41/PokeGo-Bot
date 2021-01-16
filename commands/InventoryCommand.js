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
        const inventory = await InventoryCommands.getInventory(this.msg.userId);

        let description = '';
        let fields = [];
    
        if(inventory.length == 0) {
            description = 'You have no items.';
        }
        else {
            for(var i=0;i<inventory.length;i++) {
                let item = inventory[i];
                fields.push([item.emoji + ' ' + item.name, 'Count: ' + item.amount, false]);
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