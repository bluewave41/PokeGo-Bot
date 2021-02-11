const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Teams = require('~/knex/models/Teams');
const Command = require('./Command');
const TeamListBuilder = require('~/data/Builders/TeamListBuilder');
const User = require('~/knex/models/User');

const options = {
    names: ['teams'],
    expectedParameters: [],
}

class TeamsCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const teams = await Teams.query().select('*')
            .withGraphFetched('pokemon')
            .where('player_teams.userId', this.msg.userId);
        
        await User.query().update({
            nextCommand: 'teams/QueryTeam'
        })
        .where('userId', this.msg.userId);

        const embed = {
            title: 'Teams',
            description: TeamListBuilder.build(teams),
            footer: `Create a team with create teamname`,
        }
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: TeamsCommand,
}