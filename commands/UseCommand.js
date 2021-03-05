const ItemHandler = require('~/lib/ItemHandler');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const EncounterBuilder = require('~/data/Builders/EncounterBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const CustomError = require('~/lib/errors/CustomError');
const PlayerEncounters = require('~/knex/models/PlayerEncounters');

const options = {
    names: ['use', 'u'],
    expectedParameters: [
        { name: 'item', type: 'rest', ofType: 'string', separator: '', optional: false },
        { name: 'pokemonId', type: 'number', optional: true }
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
        this.encounter = await PlayerEncounters.query().select('*')
            .where('userId', this.msg.userId)
            .first();

        canUseItem(this.item, this.itemAmount, this.msg.nextCommand, this.encounter);
    }
    async run() {
        let itemResponse;

        if(this.item.requiresEncounter) {
            itemResponse = await this.item.use(this.msg, this.encounter);

            if(itemResponse.used) {
                await InventoryCommands.removeItems(this.msg.userId, this.item.id, 1);
            }

            this.encounter = itemResponse.encounter;
            
            let pokeBalls = await InventoryCommands.getItems(this.msg.userId, [1, 2, 3]);

            if(this.item.type == 'pokeball') {
                this.encounter.activePokeball = this.item.id;
            }

            pokeBalls.find(el => el.itemId == this.encounter.activePokeball).active = true;

            const data = {
                pokemon: this.encounter.pokemon,
                position: this.encounter.pokemonPos,
                catchChance: this.encounter.catchChance,
                pokeBalls: pokeBalls,
                item: this.item
            }

            const embed = EncounterBuilder.build(this.msg, data);
            return EmbedBuilder.edit(this.msg, embed);
        }
        else {
            if(this.encounter) {
                throw new CustomError('CANT_USE_ENCOUNTER');
            }
            itemResponse = await this.item.use(this.msg, this.pokemonId);

            if(itemResponse.used) {
                await InventoryCommands.removeItems(this.msg.userId, this.item.id, 1);
            }

            this.pagination = itemResponse.pagination;

            return EmbedBuilder.build(this.msg, itemResponse.embed);
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
    if(!item || amount <= 0) {
        throw new CustomError('OUT_OF_ITEMS');
    }
    return true;
}