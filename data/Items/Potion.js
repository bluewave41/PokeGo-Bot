const Pokemon = require('~/knex/models/Pokemon');
const User = require('~/knex/models/User');
const CustomError = require('~/lib/errors/CustomError');
const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const { raw, ref } = require('objection');

class Potion {
    constructor() {
        this.id = 4;
        this.name = 'Potion';
        this.searchName = 'potion';
        this.plural = 'Potions';
        this.emoji = '<:potion:793189202404966440>';
        this.description = 'Heals a Pokemon for 20 HP.';
        this.shopItem = true;
        this.price = 50;
        this.sellPrice = 25;
        this.fromPokestop = false;
        this.fromGym = true;
        this.requiredLevel = 5;
        this.requiresEncounter = false;
        this.type = 'healing';
        this.weight = 30;
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
            saved: JSON.stringify({ value: 20 })
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

module.exports = new Potion();