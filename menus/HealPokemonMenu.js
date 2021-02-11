const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Pokemon = require('~/knex/models/Pokemon');
const User = require('~/knex/models/User');

module.exports = {
    async show(msg, parameters) {
        let pokemon = Pokemon.query().select('*', raw('COUNT(*) OVER() AS count'))
            .limit(25)
            .where('ownerId', msg.userId);

        if(parameters.type == 'heal') {
            pokemon.whereNot('hp', 'maxHP')
                   .whereNot('hp', 0);
        }
        else if(parameters.type == 'revive') {
            pokemon.where('hp', 0);
        }

        pokemon = await pokemon;

        //this could happen while the user is reviving Pokemon
        if(!pokemon.length) {
            await User.reset(msg.userId);
        }

        if(parameters.initial) {
            if(parameters.type == 'heal') {
                await User.query().update({
                    nextCommand: 'items/HealPokemon',
                    saved: JSON.stringify({ amount: parameters.amount })
                })
                .where('userID', msg.userId);
            }
            else if(parameters.type == 'revive') {
                await User.query().update({
                    nextCommand: 'items/RevivePokemon',
                    saved: JSON.stringify({ multiplier: parameters.multiplier })
                })
                .where('userID', msg.userId);
            }

            return EmbedBuilder.build(msg, {
                title: parameters.title,
                description: HealPokemonBuilder.build(pokemon, parameters.type),
                fields: [],
            })
        }
        else {
            return EmbedBuilder.edit(msg, {
                title: parameters.title,
                description: HealPokemonBuilder.build(pokemon, parameters.type),
                fields: [],
            });
        }
    }
}