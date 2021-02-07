const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const MailCommands = require('../../data/ModelHandlers/MailCommands');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Command = require('../Command');
const MailPageBuilder = require('~/data/Builders/MailPageBuilder');

const options = {
    names: [],
    expectedParameters: [
        { name: 'tableId', type: ['number'], optional: false}
    ],
    canQuit: true,
    info: 'Selecing mail to read',
    pagination: {
        emojis: ['⬅️', '➡️'],
        MAX_ENTRIES: 25,
    }
}

class OpenMail extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async buildNewPage(page) {
        const mail = await MailCommands.getMailTitles(this.msg.userId, page);

        let embed = {
            title: 'Mail',
            description: '',
            footer: `Page ${page} of ${Math.ceil(mail[0].count/this.pagination.MAX_ENTRIES)} - ${mail[0].count} results.`
        }

        for(var i=0;i<mail.length;i++) {
            embed.description += `${i+(page-1)*25+1}: ${mail[i].title} ${mail[i].read ? ':no_bell:' : ':bell:'}`;
            if(mail[i].hasRewards && !mail[i].claimedRewards) {
                embed.description += ':exclamation:';
            }
            embed.description += '\n';
        }

        return EmbedBuilder.edit(this.msg, embed);
    }
    async run() {
        const mail = await MailCommands.getMailBody(this.msg.userId, this.tableId);
        const saved = { mailId: mail.id }
        await UserCommands.update(this.msg.userId, [
            { rowName: 'saved', value: JSON.stringify(saved) }
        ]);

        let fields = [];

        if(mail.rewards && !mail.claimedRewards) {
            await UserCommands.update(this.msg.userId, [
                { rowName: 'nextCommand', value: 'mail/ClaimRewards' }
            ]);
            for(var i=0;i<mail.rewards.length;i++) {
                let reward = mail.rewards[i];
                fields.push([reward.name, reward.amount, false]);
            }
        }
        else {
            await UserCommands.reset(this.msg.userId);
        }

        let description = mail.message;

        if(mail.hasRewards && !mail.claimedRewards) {
            description += `\n\nYou can claim your rewards by typing "claim" or use the quit command to leave.`;
        }

        const embed = {
            title: mail.title,
            description: description,
            fields: fields,
            footer: null,
        }
    
        return EmbedBuilder.edit(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: OpenMail
}