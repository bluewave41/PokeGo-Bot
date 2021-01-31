const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

module.exports = {
    async show(msg, parameters) {
        const embed = {
            title: 'You won!',
            description: 'You defeated the Team Rocket grunt!',
            image: null,
            fields: [],
        }

        return EmbedBuilder.edit(msg, embed);
    }
}