const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Teams = require('~/data/Lists/TeamList');
const User = require('~/knex/models/User');
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
        const user = await User.query().select('team',' level')
            .where('userId', this.msg.userId)
            .first();

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

        await User.query().update({
            nextCommand: 'team/SelectTeam'
        })
        .where('userId', this.msg.userId);
    
        const embed = {
            title: 'Select a team',
            description: description,
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: TeamCommand
}