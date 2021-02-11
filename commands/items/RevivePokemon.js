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
    async getPokemon(page) {
        return await Pokemon.query().select('*', raw('COUNT(*) OVER() AS count'))
            .limit(25)
            .offset((page-1)*25)
            .orderBy('cp', 'DESC')
            .orderBy('pokemonId', 'DESC')
            .where('hp', 0)
            .where('ownerId', this.msg.userId).debug();
    }
    async buildNewPage(page) {
        console.log(page);
        const pokemon = await this.getPokemon(page);

        return EmbedBuilder.edit(this.msg, {
            title: 'Revive Pokemon',
            description: HealPokemonBuilder.build(pokemon, 'revive'),
            footer: `Page ${page} of ${Math.ceil(pokemon[0].count/25)} - ${pokemon[0].count} results.`
        });
    }
    async validate() {
        super.validate();
    }
    async run() {
        let pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        if(pokemon.hp > 0) {
            throw new CustomError('NOT_FAINTED');
        }
        const user = await User.query().select('saved', 'page', 'maxPage')
            .where('userId', this.msg.userId)
            .first();
        const saved = user.json;

        await Pokemon.query().update({
            hp: Math.floor(pokemon.maxHP * saved.multiplier)
        })
        .where('pokemonId', this.pokemonId);

        pokemon = await this.getPokemon(user.page);
        if(!pokemon.length && user.page > 1) {
            pokemon = await this.getPokemon(user.page-1);
            //change the page number if user revived the last Pokemon on a page
            if(pokemon.length) {
                await User.query().update({
                    page: user.page-1,
                    maxPage: user.maxPage-1
                })
                .where('userId', this.msg.userId);

                user.page--;
            }
        }

        let embed = {
            title: 'Revive Pokemon',
            description: HealPokemonBuilder.build(pokemon, 'revive'),
            footer: '',
        }

        if(pokemon.length) {
            embed.footer = `Page ${user.page} of ${Math.ceil(pokemon[0].count/25)} - ${pokemon[0].count} results.`;
        }
        else {
            await User.reset(this.msg.userId);
        }

        return EmbedBuilder.edit(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: RevivePokemon
}