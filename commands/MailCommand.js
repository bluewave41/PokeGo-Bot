const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const MailCommands = require('../data/ModelHandlers/MailCommands');
const Command = require('./Command');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const MailPageBuilder = require('~/data/Builders/MailPageBuilder');

const options = {
    names: ['mail'],
    expectedParameters: [],
    MAX_ENTIRES: 25,
}

class MailCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.mail = await MailCommands.getMailTitles(this.msg.userId, 1);
        this.mailCount = this.mail.length ? this.mail[0].count : 0;
    }
    async run() {
        const embed = MailPageBuilder.build(this.mail, 1);

        if(this.mail.length) {
            const saved = { page: 1, maxPage: Math.ceil(this.mailCount/options.MAX_ENTIRES) }
            await UserCommands.update(this.msg.userId, [
                { rowName: 'nextCommand', value: 'mail/OpenMail' },
                { rowName: 'saved', value: JSON.stringify(saved) }
            ]);
        }

        return EmbedBuilder.build(this.msg, embed);
    }
    async afterSend(lastMessageId) {
        if(this.mailCount > options.MAX_ENTIRES) {
            const message = await this.msg.channel.messages.fetch(lastMessageId);
            message.react('⬅️');
            message.react('➡️');
        }
    }
}

module.exports = {
    options: options,
    class: MailCommand,
}