const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const PokemonBuilder = require('~/lib/PokemonBuilder');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const Command = require('./Command');
const RedeemCodeCommands = require('~/data/ModelHandlers/RedeemCodeCommands');

const options = {
    names: ['redeem'],
    expectedParameters: [
        { name: 'code', type: 'string', optional: false }
    ]
}

class RedeemCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.items = await RedeemCodeCommands.getItems(this.code);
    }
    async run() {
        this.items = this.items.split('|');
        //i,id,amount
        //p,id,flags
        for(var i=0;i<this.items.length;i++) {
            let item = this.items[i].split(',');
            if(item[0] == 'i') {
                await InventoryCommands.addItems(this.msg.userId, item[1], item[2]);
            }
            else if(item[0] == 'p') {
                let flags = {};
                for(var j=2;j<item.length;j++) { //flags
                    let flag = item[j].split('=');
                    if(flag[1] == 'true') {
                        flags[flag[0]] = true;
                    }
                    else {
                        flags[flag[0]] = parseInt(flag[1]);
                    }
                }
                let pokemon = PokemonBuilder.generatePokemon(item[1], 5, this.msg.userId, flags);
                await PokemonCommands.catchPokemon(this.msg.userId, pokemon, 3);
            }
        }
    }
}

module.exports = {
    options: options,
    class: RedeemCommand
}