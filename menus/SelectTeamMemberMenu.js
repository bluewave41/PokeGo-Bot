const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const TeamBuilder = require('~/data/Builders/TeamBuilder');

module.exports = {
    async show(msg, parameters) {
        const team = parameters.team;
        const embed = {
            title: parameters.title,
            description: parameters.description,
            fields: TeamBuilder.build(team)
        }
        return EmbedBuilder.edit(msg, embed);
    }
}