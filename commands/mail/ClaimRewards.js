const Mail = require('~/knex/models/Mail');
const CustomError = require('~/lib/errors/CustomError');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('../Command');
const MailCommands = require('~/data/ModelHandlers/MailCommands');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const User = require('~/knex/models/User');

const options = {
    names: [],
    expectedParameters: [
        { name: 'choice', type: ['string'], optional: false }
    ],
    canQuit: true,
    info: 'Reading mail message'
}

class ClaimRewards extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        if(this.choice != 'claim') {
            throw new CustomError('INVALID_RESPONSE');
        }
    }
    async quit() {
        const message = await this.msg.channel.messages.fetch(this.msg.lastMessageId);
        await message.delete();
    }
    async run() {
        const user = await User.query().select('saved')
            .where('userId', this.msg.userId);
        const saved = user.json;
        const mailId = saved.mailId;
        const mail = await MailCommands.getRewards(this.msg.userId, mailId);

        let description = 'You received: \n';

        for(var i=0;i<mail.rewardDisplay.length;i++) {
            const reward = mail.rewardDisplay[i].split(' ');
            const amount = reward.shift();
            const name = reward.join(' ');
            description += `${amount} ${name}\n`;
            await InventoryCommands.addItems(this.msg.userId, mail.rewards[i].itemId, mail.rewards[i].amount);
        }
    
        //update mail flag
        await Mail.query().update({
            claimedRewards: true
        })
        .where('id', mailId);

        await User.reset(this.msg.userId);
    
        const embed = {
            title: 'Claimed',
            description: description,
            fields: [],
            footer: '', //TODO: add claim string here
        }
    
        return EmbedBuilder.edit(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: ClaimRewards
}