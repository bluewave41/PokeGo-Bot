const Command = require('./Command');
const EmbedBuilder = require(`~/data/Builders/EmbedBuilder`);

const options = {
    names: ['help'],
    expectedParameters: [],
    global: true
}

class HelpCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const embed = {
            title: 'Help',
            description: `View commands and manage your Pokemon at http://www.bluewave41.xyz/.`
        }
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: HelpCommand
}