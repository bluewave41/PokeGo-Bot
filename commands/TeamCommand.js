const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Teams = require('~/data/Lists/TeamList');
const Command = require('./Command');
const CustomError = require('~/lib/errors/CustomError');

const options = {
    names: ['team'],
    expectedParameters: [],
    nextCommand: 'Team/SelectTeam'
}

class TeamCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        const user = await UserCommands.getFields(this.msg.userId, ['team', 'level']);
        if(user.team) {
            throw new CustomError('ALREADY_SELECTED_TEAM');
        }
        if(user.level < 5) {
            throw new CustomError('TEAM_LEVEL_TOO_LOW');
        }
    }
    async run() {
        const teams = Teams.teams;

        let description = '';
        for(var i=0;i<teams.length;i++) {
            let team = teams[i];
            description += `${i+1}. ${team.name} ${team.emoji}\n`
        }
    
        const embed = {
            title: 'Select a team',
            description: description,
        }
    
        super.run();
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: TeamCommand
}