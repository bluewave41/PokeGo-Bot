const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const User = require('~/knex/models/User');
const PlayerEncounters = require('~/knex/models/PlayerEncounters');
const Caught = require('~/knex/models/Caught');
const Command = require('./Command');

const options = {
    names: ['reset'],
    expectedParameters: [],
    ownerOnly: true,
    global: true,
}

class ResetCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        await PlayerEncounters.query().delete()
            .where('userId', this.msg.userId);

        await Caught.query().delete()
            .where('userId', this.msg.userId);

        await User.query().delete()
            .where('userId', this.msg.userId);

        let embed = {
            title: 'Reset',
            description: 'You have been reset.'
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: ResetCommand
}