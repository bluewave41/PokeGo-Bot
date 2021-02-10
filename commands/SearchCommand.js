const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const SpriteListBuilder = require('~/data/Builders/SpriteListBuilder');
const UserCommands = require('../data/ModelHandlers/UserCommands');
const EncounterCommands = require('~/data/ModelHandlers/EncounterCommands');
const Command = require('./Command');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const CustomError = require('~/lib/errors/CustomError');

const options = {
    names: ['search'],
    expectedParameters: [],
}

class SearchCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        await canAccess(this.msg.userId);
    }
    async run() {
        const user = await UserCommands.getFields(this.msg.userId, ['location', 'secretId', 'level']);
        const sprites = await EncounterCommands.getSprites(this.msg.userId, user.location, user.secretId, user.level);
        if(!sprites.length) {
            throw new CustomError('CELL_EMPTY');
        }

        let embed = {
            title: 'Pokemon in the area',
            description: SpriteListBuilder.build(sprites)
        }

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'encounter/StartEncounter' }
        ]);
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

async function canAccess(userId) {
    const storageAmount = await UserCommands.getFields(userId, 'storage');
    const pokemonCount = await PokemonCommands.getPokemonCount(userId);
    if(pokemonCount+1 > storageAmount) {
        throw new CustomError('STORAGE_FULL');
    }
    return true;
}

module.exports = {
    options: options,
    class: SearchCommand
}