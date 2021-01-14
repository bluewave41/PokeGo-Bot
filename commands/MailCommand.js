const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const MailCommands = require('../data/ModelHandlers/MailCommands');
const Command = require('./Command');

const options = {
    names: ['mail'],
    expectedParameters: [],
    nextCommand: 'mail/OpenMail',
}

class MailCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const mail = await MailCommands.getMailTitles(this.msg.userId);

        let embed = {
            title: 'Mail',
            description: ''
        }
    
        if(!mail.length) {
            embed.description = 'You have no mail.';
            return EmbedBuilder.build(this.msg, embed);
            //return early so we don't set next command
        }
        else {
            for(var i=0;i<mail.length;i++) {
                embed.description += `${i+1}: ${mail[i].title} ${mail[i].read ? ':no_bell:' : ':bell:'}\
                    ${mail[i].claimedrewards ? '' : ':exclamation:'}\n`; 
            }
        }
    
        super.run();
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: MailCommand,
}