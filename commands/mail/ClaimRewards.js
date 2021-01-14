const Mail = require('~/knex/models/Mail');
const CustomError = require('~/lib/errors/CustomError');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('../Command');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const MailCommands = require('~/data/ModelHandlers/MailCommands');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');

const options = {
    names: [],
    expectedParameters: [
        { name: 'choice', type: ['string'], optional: false}
    ],
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
    async run() {
        const saved = await UserCommands.getSaved(this.msg.userId);
        const mailId = saved.mailId;
        const rewards = await MailCommands.getRewards(this.msg.userId, mailId);

        let description = 'You received: \n';

        for(var i=0;i<rewards.length;i++) {
            let reward = rewards[i];
            description += rewards[i].amount + ' ' + rewards[i].name + '\n';
            await InventoryCommands.addItems(this.msg.userId, reward.itemId, reward.amount);
        }
    
        //update mail flag
        await Mail.query().update({
            claimedrewards: true
        })
        .where('id', mailId);

        await UserCommands.reset(this.msg.userId);
    
        const embed = {
            title: 'Claimed',
            description: description
        }
    
        return EmbedBuilder.edit(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: ClaimRewards
}