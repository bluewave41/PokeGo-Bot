const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const MailCommands = require('../data/ModelHandlers/MailCommands');
const Command = require('./Command');
const User = require('~/knex/models/User');
const MailPageBuilder = require('~/data/Builders/MailPageBuilder');

const options = {
    names: ['mail'],
    expectedParameters: [],
    pagination: {
        emojis: ['⬅️', '➡️'],
        MAX_ENTRIES: 25
    }
}

class MailCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.mail = await MailCommands.getMailTitles(this.msg.userId, 1);
        this.pagination.entryCount = this.mail.length ? this.mail[0].count : 0;
    }
    async run() {
        const embed = MailPageBuilder.build(this.mail, 1);

        if(this.mail.length) {
            await User.setNextCommand(this.msg.userId, 'mail/OpenMail');
        }

        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: MailCommand,
}