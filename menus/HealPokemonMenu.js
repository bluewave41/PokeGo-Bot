const HealPokemonBuilder = require('~/data/Builders/HealPokemonBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

module.exports = {
    async show(msg, parameters) {

        return EmbedBuilder.edit(msg, {
            title: parameters.title,
            description: HealPokemonBuilder.build(pokemon),
            fields: [],
        });
    }
}