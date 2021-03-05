const Pokemon = require('~/knex/models/Pokemon');
const User = require('~/knex/models/User');
const CustomError = require('~/lib/errors/CustomError');
const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const { raw, ref } = require('objection');
const ItemResponse = require('~/lib/ItemResponse');

class HyperPotion {
    constructor() {
        this.id = 12;
        this.name = 'Hyper Potion';
        this.searchName = 'hyperpotion';
        this.plural = 'Hyper Potions';
        this.emoji = '<:hyperpotion:795635140159602728>';
        this.description = 'Heals a Pokemon for 200 HP.';
        this.shopItem = false;
        this.price = 500;
        this.sellPrice = 250;
        this.fromPokestop = false;
        this.fromGym = true;
        this.requiredLevel = 15;
        this.requiresEncounter = false;
        this.type = 'healing';
        this.weight = 10;
    }
    async use(msg) {
        const pokemon = await Pokemon.query().select('*', raw('COUNT(*) OVER() AS count'))
            .limit(25)
            .orderBy('cp', 'DESC')
            .orderBy('pokemonId', 'DESC')
            .whereNot('hp', 0)
            .whereNot('hp', ref('maxHP'))
            .where('ownerId', msg.userId);

        if(!pokemon.length) {
            throw new CustomError('NO_HURT_POKEMON');
        }

        await User.query().update({
            nextCommand: 'items/HealPokemon',
            saved: JSON.stringify({ value: 200, itemId: this.id })
        })
        .where('userId', msg.userId);

        const itemResponse = new ItemResponse(false);
        itemResponse.setPagination(new Pagination(25, pokemon[0].count));
        itemResponse.setEmbed({
            title: 'Heal Pokemon',
            description: HealPokemonBuilder.build(pokemon, 'heal'),
            footer: `Page 1 of ${Math.ceil(pokemon[0].count/25)} - ${pokemon[0].count} results.`
        });

        return itemResponse;
    }
}

module.exports = new HyperPotion();