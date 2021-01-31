const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Teams = require('~/knex/models/Teams');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Command = require('./Command');
const TeamListBuilder = require('~/data/Builders/TeamListBuilder');

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
            .where('player_teams.userId', this.msg.userId).debug();

        console.log('TEAMS', teams);

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'teams/QueryTeam' }
        ]);

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