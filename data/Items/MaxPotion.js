const Pokemon = require('~/knex/models/Pokemon');
const User = require('~/knex/models/User');
const CustomError = require('~/lib/errors/CustomError');
const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const { raw, ref } = require('objection');

class MaxPotion {
    constructor() {
        this.id = 14;
        this.name = 'Max Potion';
        this.searchName = 'maxpotion';
        this.plural = 'Max Potions';
        this.emoji = '<:maxpotion:795636999520124928>';
        this.description = 'Heals a Pokemon to full HP.';
        this.shopItem = false;
        this.price = 700;
        this.sellPrice = 350;
        this.fromPokestop = true;
        this.requiredLevel = 30;
        this.requiresEncounter = false;
        this.type = 'healing';
    }
    async use(msg) {
        const pokemon = await Pokemon.query().select('*', raw('COUNT(*) OVER() AS count'))
            .limit(25)
            .orderBy('cp', 'DESC')
            .orderBy('pokemonId', 'DESC')
            .whereNot('hp', 0)
            .whereNot('hp', ref('maxHP'))
            .where('ownerId', msg.userId).debug();

        if(!pokemon.length) {
            throw new CustomError('NO_HURT_POKEMON');
        }

        await User.query().update({
            nextCommand: 'items/HealPokemon',
            saved: JSON.stringify({ value: 999 })
        })
        .where('userId', msg.userId);

        return {
            pagination: {
                emojis: ['⬅️', '➡️'],
                MAX_ENTRIES: 25,
                entryCount: pokemon[0].count
            },
            embed: {
                title: 'Heal Pokemon',
                description: HealPokemonBuilder.build(pokemon, 'heal'),
                footer: `Page 1 of ${Math.ceil(pokemon[0].count/25)} - ${pokemon[0].count} results.`
            }
        }
    }
}

module.exports = new MaxPotion();