const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Emojis = require('~/data/Lists/EmojiList');
const MedalCommands = require('../data/ModelHandlers/MedalCommands');
const Command = require('./Command');

const options = {
    names: ['medals'],
    expectedParameters: [],
}

class MedalCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const medals = await MedalCommands.getMedals(this.msg.userId);
        
        let fields = [];

        for(var i=0;i<medals.length;i++) {
            let medal = medals[i];
            let field = [medal.name, medal.description + '\n' + medal.amount + '/' + medal.target, true];
            if(medal.tier != 'NONE') {
                field[0] += ' ' + Emojis[medal.tier];
            }
            fields.push(field);
        }

        const embed = {
            title: 'Medals',
            description: 'Medals',
            fields: fields,
        }

        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: MedalCommand
}