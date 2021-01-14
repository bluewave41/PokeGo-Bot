const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const Command = require('./Command');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Pokemon = require('../knex/models/Pokemon');
const { raw } = require('objection');

const options = {
    names: ['favorite', 'favourite'],
    expectedParameters: [
        { name: 'pokemonId', type: 'number', optional: false }
    ]
}

class FavoriteCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
    }
    async run() {
        const pokemon = await Pokemon.query().updateAndFetchById(this.pokemonId, {
            favorite: raw('!favorite')
        })
        .where('ownerId', this.msg.userId)
        .where('pokemonId', this.pokemonId);

        let embed = {
            title: 'Favorite',
            description: `${pokemon.name} was ` + ((pokemon.favorite) ? 'added to ' : 'removed from ') + 'your favorites list!',
            image: pokemon.url,
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: FavoriteCommand
}