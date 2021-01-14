const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const MailCommands = require('../../data/ModelHandlers/MailCommands');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Command = require('../Command');

const options = {
    names: [],
    expectedParameters: [
        { name: 'tableId', type: ['number'], optional: false}
    ],
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

        let fields = [];

        if(mail.rewards && !mail.claimedrewards) {
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

        if(!mail.claimedrewards) {
            description += `\n\nYou can claim your rewards by typing "claim" or use the quit command to leave.`;
        }

        const embed = {
            title: mail.title,
            description: description,
            fields: fields,
        }

        if(!mail.claimedrewards) {
            embed.des
        }
    
        return EmbedBuilder.edit(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: OpenMail
}