const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Teams = require('~/data/Lists/TeamList');
const ColorList = require('~/data/Lists/ColorList');
const Command = require('../Command');
const User = require('~/knex/models/User');

const options = {
    names: [],
    expectedParameters: [
        { name: 'choice', type: 'number', optional: false }
    ],
    canQuit: true,
    info: 'Selecting a team to join'
}

class SelectTeam extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        if(this.choice > Teams.teams.length) {
            throw new CustomError('INVALID_RANGE_CHOICE');
        }
    }
    async run() {
        const team = Teams.teams[this.choice-1];
        await User.query().update({
            team: this.choice
        })
        .where('userId', this.msg.userId);

        const embed = {
            title: 'Team selected',
            description: `Congratulations! You're now a member of team ${team.name} ${team.emoji}!`,
            color: ColorList[this.choice],
        }
    
        await User.reset(this.msg.userId);
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: SelectTeam
}