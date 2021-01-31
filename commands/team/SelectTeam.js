const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Teams = require('~/data/Lists/TeamList');
const ColorList = require('~/data/Lists/ColorList');
const Command = require('../Command');
const UserCommands = require('~/data/ModelHandlers/UserCommands');

const options = {
    names: [],
    expectedParameters: [
        { name: 'choice', type: 'number', optional: false }
    ],
    nextCommand: null,
    canQuit: true,
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
        await UserCommands.update(this.msg.userId, [
            { rowName: 'team', value: this.choice }
        ]);

        const embed = {
            title: 'Team selected',
            description: `Congratulations! You're now a member of team ${team.name} ${team.emoji}!`,
            color: ColorList[this.choice],
        }
    
        super.run();
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: SelectTeam
}