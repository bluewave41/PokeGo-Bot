const Pokemon = require('~/knex/models/Pokemon');
const User = require('~/knex/models/User');
const CustomError = require('~/lib/errors/CustomError');
const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const { raw } = require('objection');
const ItemResponse = require('~/lib/ItemResponse');

class MaxRevive {
    constructor() {
        this.id = 13;
        this.name = 'Max Revive';
        this.searchName = 'maxrevive';
        this.plural = 'Max Revives';
        this.emoji = '<:maxrevive:795635140218978304>';
        this.description = 'Revives a Pokemon from being fainted with full HP.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = false;
        this.fromGym = true;
        this.requiredLevel = 30;
        this.requiresEncounter = false;
        this.type = 'revive';
        this.weight = 5;
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
            saved: JSON.stringify({ multiplier: 1, itemId: this.id })
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

module.exports = new MaxRevive();