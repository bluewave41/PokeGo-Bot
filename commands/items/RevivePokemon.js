const Command = require('../Command');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

const options = {
    names: [],
    expectedParameters: [
        { name: 'pokemonId', type: 'number', optional: false }
    ],
    canQuit: true,
    info: 'Reviving Pokemon',
    pagination: {
        emojis: ['⬅️', '➡️'],
        MAX_ENTRIES: 25,
    }
}

class RevivePokemon extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async buildNewPage(page) {

    }
    async validate() {
        super.validate();
    }
    async run() {
        const pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        await Pokemon.update(this.msg.userId, [
            { rowName: 'hp', value: Math.floor(pokemon.maxHP/2) }
        ]);

    }
}

module.exports = {
    options: options,
    class: RevivePokemon
}