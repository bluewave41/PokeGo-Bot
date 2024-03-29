const Pokemon = require('~/knex/models/Pokemon');
const User = require('~/knex/models/User');
const CustomError = require('~/lib/errors/CustomError');
const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const { raw } = require('objection');
const ItemResponse = require('~/lib/ItemResponse');

class Revive {
    constructor() {
        this.id = 10;
        this.name = 'Revive';
        this.searchName = 'revive';
        this.plural = 'Revives';
        this.emoji = '<:revive:795413532791144518>';
        this.description = 'Revives a Pokemon from being fainted with half HP.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = false;
        this.fromGym = true;
        this.requiredLevel = 5;
        this.requiresEncounter = false;
        this.type = 'revive';
        this.weight = 30;
    }
    async use(msg) {
        const pokemon = await Pokemon.query().select('*', raw('COUNT(*) OVER() AS count'))
            .limit(25)
            .orderBy('cp', 'DESC')
            .orderBy('pokemonId', 'DESC')
            .where('hp', 0)
            .where('ownerId', msg.userId);

        if(!pokemon.length) {
            throw new CustomError('NO_FAINTED_POKEMON');
        }

        await User.query().update({
            nextCommand: 'items/RevivePokemon',
            saved: JSON.stringify({ multiplier: 0.5, itemId: this.id })
        })
        .where('userId', msg.userId);

        const itemResponse = new ItemResponse(false);
        itemResponse.setPagination(25, pokemon[0].count);
        itemResponse.setEmbed({
            title: 'Revive Pokemon',
            description: HealPokemonBuilder.build(pokemon, 'revive'),
            footer: `Page 1 of ${Math.ceil(pokemon[0].count/25)} - ${pokemon[0].count} results.`
        });

        return itemResponse;
    }
}

module.exports = new Revive();