const Command = require('./Command');
const Mail = require('~/knex/models/Mail');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Utils = require('~/lib/Utils');
const MailCommands = require('~/data/ModelHandlers/MailCommands');

const options = {
    names: ['addMail'],
    expectedParameters: [
        { name: 'amount', type: 'number', optional: false },
        { name: 'type', type: 'string', optional: true, default: 'random' }
    ],
    ownerOnly: true,
}

class AddMailCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        let values = [];
        if(this.type == 'level') {
            for(var i=2;i<=40;i++) {
                await MailCommands.addLevelUpMail(this.msg.userId, i);
            }
        }
        else {
            for(var i=0;i<this.amount;i++) {
                values.push({
                    userId: this.msg.userId,
                    title: Utils.generateRandomString(10),
                    message: Utils.generateRandomString(50),
                    hasRewards: false,
                });
            }
            await Mail.knex().table('mail').insert(values);
        }

        return EmbedBuilder.build(this.msg, {
            title: 'Added',
            description: `Added mail.`
        });
    }
}

module.exports = {
    options: options,
    class: AddMailCommand
}