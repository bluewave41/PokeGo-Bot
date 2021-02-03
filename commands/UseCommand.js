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
            await InventoryCommands.removeItems(this.msg.userId, this.item.id, 1);
            const embed = await this.item.use(this.msg.userId, this.pokemonId);
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