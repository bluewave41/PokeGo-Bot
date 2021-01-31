const Teams = require('~/knex/models/Teams');
const TeamListBuilder = require('~/data/Builders/TeamListBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

module.exports = {
    async show(msg, parameters) {
        const teams = await Teams.query().select('*')
            .withGraphFetched('pokemon')
            .where('player_teams.userId', msg.userId);

        const embed = {
            title: 'Teams',
            description: TeamListBuilder.build(teams, parameters.showInvalid),
        }

        return EmbedBuilder.build(msg, embed);
    }
}