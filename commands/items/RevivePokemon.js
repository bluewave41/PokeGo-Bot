const Command = require('../Command');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const CustomError = require('../../lib/errors/CustomError');
const User = require('~/knex/models/User');
const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const Pokemon = require(`~/knex/models/Pokemon`);
const { raw } = require('objection');
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
        const pokemon = await Pokemon.query().select('*', raw('COUNT(*) OVER() AS count'))
            .limit(25)
            .offset((page-1)*25)
            .where('hp', 0)
            .where('ownerId', this.msg.userId);

        return EmbedBuilder.edit(this.msg, {
            title: 'Revive Pokemon',
            description: HealPokemonBuilder.build(pokemon)
        });
    }
    async validate() {
        super.validate();
    }
    async run() {
        const pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        if(pokemon.hp > 0) {
            throw new CustomError('NOT_FAINTED');
        }

        const user = await User.query().select('saved', 'page')
            .where('userId', this.msg.userId);
        const saved = user.json;

        await PokemonCommands.update(this.msg.userId, [
            { rowName: 'hp', value: Math.floor(pokemon.maxHP*saved.multiplier) }
        ]);

        return EmbedBuilder.edit(this.msg, {
            title: 'Revive Pokemon',
            description: HealPokemonBuilder.build()
        });
    }
}

module.exports = {
    options: options,
    class: RevivePokemon
}