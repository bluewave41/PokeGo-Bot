const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const SpriteListBuilder = require('~/data/Builders/SpriteListBuilder');
const EncounterCommands = require('~/data/ModelHandlers/EncounterCommands');
const Command = require('./Command');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const CustomError = require('~/lib/errors/CustomError');
const User = require('~/knex/models/User');

const options = {
    names: ['search'],
    expectedParameters: [],
}

class SearchCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async setup() {
        this.user = await User.query().select('location', 'secretId', 'level', 'storage')
            .where('userId', this.msg.userId)
            .first();
    }
    async validate() {
        super.validate();
        await this.setup();
        await canAccess(this.msg.userId);
    }
    async run() {
        const sprites = await EncounterCommands.getSprites(this.msg.userId, this.user.location, this.user.secretId,
            this.user.level);
            
        if(!sprites.length) {
            throw new CustomError('CELL_EMPTY');
        }

        let embed = {
            title: 'Pokemon in the area',
            description: SpriteListBuilder.build(sprites)
        }

        await User.query().update({
            nextCommand: 'encounter/StartEncounter'
        })
        .where('userId', this.msg.userId);
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

async function canAccess(userId) {
    const pokemonCount = await PokemonCommands.getPokemonCount(userId);
    if(pokemonCount+1 > this.user.storage) {
        throw new CustomError('STORAGE_FULL');
    }
    return true;
}

module.exports = {
    options: options,
    class: SearchCommand
}