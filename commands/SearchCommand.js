const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const SpriteListBuilder = require('~/data/Builders/SpriteListBuilder');
const EncounterCommands = require('~/data/ModelHandlers/EncounterCommands');
const Command = require('./Command');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const CustomError = require('~/lib/errors/CustomError');
const User = require('~/knex/models/User');
const TravelRequests = require('~/knex/models/TravelRequests');

const options = {
    names: ['search', 's'],
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

        const pokemonCount = await PokemonCommands.getPokemonCount(this.msg.userId);
        if(pokemonCount+1 > this.user.storage) {
            throw new CustomError('STORAGE_FULL');
        }

        const travelRequest = await TravelRequests.query().select('userId')
            .where('userId', this.msg.userId)
            .first();
            
        if(travelRequest) {
            throw new CustomError('TRAVEL_IN_PROGRESS');
        }
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

        await User.setNextCommand(this.msg.userId, 'encounter/StartEncounter');
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: SearchCommand
}