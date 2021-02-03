const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

module.exports = {
    async show(msg, parameters) {
        const embed = {
            title: 'You won!',
            description: 'You defeated the Team Rocket grunt!\n\nSend any message to start catching.',
            image: null,
            fields: [],
        }

        return EmbedBuilder.edit(msg, embed);
    }
}