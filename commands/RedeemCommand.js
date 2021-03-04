const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const PokemonBuilder = require('~/lib/PokemonBuilder');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const Command = require('./Command');
const RedeemCodeCommands = require('~/data/ModelHandlers/RedeemCodeCommands');
const RedeemedCodes = require('~/knex/models/RedeemedCodes');
const CustomError = require('~/lib/errors/CustomError');
const ItemEnums = require('../data/Lists/ItemEnums');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

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
        await canRedeemCode(this.msg.userId, this.code);
        this.items = await RedeemCodeCommands.getItems(this.code);
    }
    async run() {
        this.items = this.items.split('|');
        let description = '';
        //i,id,amount
        //p,id,flags
        await RedeemedCodes.query().insert({
            userId: this.msg.userId,
            redeemId: this.code
        });
        for(var i=0;i<this.items.length;i++) {
            let item = this.items[i].split(',');
            if(item[0] == 'i') {
                await InventoryCommands.addItems(this.msg.userId, item[1], item[2]);
                description += item[2] + ' ' + ItemEnums[item[1]] + '\n';
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
                description += pokemon.name + '\n';
            }
        }
        
        return EmbedBuilder.build(this.msg, {
            title: 'Redeemed',
            description: 'You received: \n' + description
        });
    }
}

module.exports = {
    options: options,
    class: RedeemCommand
}

async function canRedeemCode(userId, code) {
    const hasRedeemed = await RedeemedCodes.query().select('*')
        .where('userId', userId)
        .where('redeemId', code)
        .first();

    if(hasRedeemed) {
        throw new CustomError('ALREADY_REDEEMED');
    }
}