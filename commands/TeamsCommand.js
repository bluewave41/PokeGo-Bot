const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Teams = require('~/knex/models/Teams');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Command = require('./Command');

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
        const teams = await Teams.query().select('name')
            .where('userId', this.msg.userId);

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'teams/QueryTeam' }
        ]);

        let description = 'You have no teams.';
        if(teams) {
            description = '';
            for(var i=0;i<teams.length;i++) {
                description += i+1 + '. ' + teams[i].name + '\n';
            }
        }

        const embed = {
            title: 'Teams',
            description: description,
            footer: `Create a team with create teamname`,
        }
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: TeamsCommand,
}