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
    info: 'Selecing mail to read'
}

class OpenMail extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const mail = await MailCommands.getMailBody(this.msg.userId, this.tableId);
        const saved = { mailId: mail.id }
        await UserCommands.update(this.msg.userId, [
            { rowName: 'saved', value: JSON.stringify(saved) }
        ]);

        console.log(mail)

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
    async handleReactionAdd(reaction) {
        const validEmojis = ['⬅️', '➡️'];
        let updateDisplay = false;
        if(!validEmojis.includes(reaction.emoji.name)) {
            return;
        }
        const saved = await UserCommands.getSaved(this.msg.userId);
        switch(reaction.emoji.name) {
            case '⬅️':
                if(saved.page-1 > 0) {
                    saved.page--;
                    updateDisplay = true;
                }
                break;
            case '➡️':
                if(saved.page+1 <= saved.maxPage) {
                    saved.page++;
                    updateDisplay = true;
                }
        }

        await reaction.users.remove(this.msg.author.id);

        if(!updateDisplay) {
            return;
        }

        await UserCommands.update(this.msg.userId, [
            { rowName: 'saved', value: JSON.stringify(saved) }
        ]);

        const mail = await MailCommands.getMailTitles(this.msg.userId, saved.page);

        const embed = MailPageBuilder.build(mail, saved.page);

        return EmbedBuilder.edit(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: OpenMail
}