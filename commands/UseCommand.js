const ItemHandler = require('~/lib/ItemHandler');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const EncounterBuilder = require('~/data/Builders/EncounterBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const CustomError = require('~/lib/errors/CustomError');
const PlayerEncounters = require('~/knex/models/PlayerEncounters');

const options = {
    names: ['use'],
    expectedParameters: [
        { name: 'item', type: 'rest', ofType: 'string', separator: '', optional: false }
    ],
    global: true,
}

class UseCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.item = ItemHandler.getItem(this.item);
        this.itemAmount = await InventoryCommands.getItemCount(this.msg.userId, this.item.id);
        if(this.item.requiresEncounter) {
            this.encounter = await PlayerEncounters.query().select('*')
                .where('userId', this.msg.userId)
                .first();
        }
        canUseItem(this.item, this.itemAmount, this.msg.nextCommand, this.encounter);
    }
    async run() {
        if(this.item.requiresEncounter) {
            await this.item.use(this.msg.userId);

            let pokeBalls = await InventoryCommands.getPokeballs(this.msg.userId);

            if(this.item.type == 'pokeball') {
                this.encounter.activePokeball = this.item.id;
            }
            else {
                this.encounter.item = this.item.id;
            }

            pokeBalls.find(el => el.itemId == this.encounter.activePokeball).active = true;

            const data = {
                pokemon: this.encounter.pokemon,
                position: this.encounter.pokemonPos,
                catchChance: this.encounter.catchChance,
                pokeBalls: pokeBalls,
            }

            const embed = EncounterBuilder.build(this.msg, data);
            return EmbedBuilder.edit(this.msg, embed);
        }
        else {
            const embed = await this.item.use(this.msg);
            return EmbedBuilder.build(this.msg, embed);
        }
    }
}

module.exports = {
    options: options,
    class: UseCommand,
}

function canUseItem(item, amount, nextCommand, encounter) {
    //are we in an encounter?
    if(item.requiresEncounter) {
        if(!encounter) {
            throw new CustomError('CANT_USE_ITEM');
        }
        if(nextCommand != 'encounter/SelectSquare') {
            throw new CustomError("CANT_USE_ITEM");
        }
        //did we already use an item?
        if(item.type != 'pokeball' && encounter.item) {
            throw new CustomError('ALREADY_USED_ITEM');
        }
    }
    //do we have the item we need?
    if(!item || amount == 0) {
        throw new CustomError('OUT_OF_ITEMS');
    }
    return true;
}

/*
            let pokeBalls = await InventoryCommands.getPokeballs(userId);

            const { amount } = await InventoryCommands.getItemCount(userId, item.id);

            //can we use the item we want?
            await canUseItem(item, amount, user.nextCommand, user.encounter);

            let updateObject = {};

            if(item.use) {
                let itemUse = item.use();
                let value;
    
                switch(itemUse.flag) {
                    case 'set':
                        value = itemUse.value;
                        break;
                    case 'multiply':
                        value = user.encounter[itemUse.column] * itemUse.value;
                        break;
                    default:
                        console.log('failed to determine item function');
                        break;
                }
                updateObject[itemUse.column] = value;
            }

            let clientData = { pokemon: user.encounter.pokemon.infoForUser,
                type: 'update', position: user.encounter.pokemonPos }
            
            if(item.type != 'pokeball') {
                updateObject.item = item.id;
                user.encounter.item = item.id;
                clientData.item = {name: item.name, emoji: item.emoji, type: item.type}
                clientData.pokeBalls = pokeBalls;
            }
            else {
                user.encounter.activePokeball = item.id;
                clientData.pokeBalls = pokeBalls;
            }

            pokeBalls.find(el => el.itemId == user.encounter.activePokeball).active = true;

            //use the item
            await PlayerEncounters.query().update(updateObject)
                .where('userId', userId);

            clientData.catchChance = user.encounter.catchChance;

            res.json(clientData);
        }
    }
}*/