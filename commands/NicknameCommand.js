const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PokemonCommands = require('../data/ModelHandlers/PokemonCommands');
const Pokemon = require('../knex/models/Pokemon');
const CustomError = require('../lib/errors/CustomError');
const Command = require('./Command');

const options = {
    names: ['nickname', 'nick'],
    expectedParameters: [
        { name: 'pokemonId', type: ['number'], optional: false },
        { name: 'nickname', type: 'rest', ofType: 'string', separator: ' ', optional: false }
    ]
}

class NicknameCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        const nicknameRegex = /^[a-zA-Z0-9 ]+$/;
        if(this.nickname.length > 20) {
            throw new CustomError('INVALID_NAME_LENGTH');
        }
        if(!nicknameRegex.test(this.nickname)) {
            throw new CustomError('INVALID_NAME');
        }
        //check that user owns pokemon
        this.pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        //check name length
    }
    async run() {
        let pokemon = await Pokemon.query()
            .updateAndFetchById(this.pokemonId, { nickname: this.nickname })
            .where('ownerId', this.msg.userId)
            .where('pokemonId', this.pokemonId);

        pokemon.oldName = this.pokemon.name;

        let embed = {
            title: 'Nickname',
            description: `${pokemon.oldName}'s name was changed to ${pokemon.nickname}!`,
            image: pokemon.url
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: NicknameCommand
}