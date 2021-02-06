const Command = require('./Command');
const Mail = require('~/knex/models/Mail');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Utils = require('~/lib/Utils');

const options = {
    names: ['addMail'],
    expectedParameters: [
        { name: 'amount', type: 'number', optional: false }
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
        for(var i=0;i<this.amount;i++) {
            values.push({
                userId: this.msg.userId,
                title: Utils.generateRandomString(10),
                message: Utils.generateRandomString(50),
                hasRewards: false,
            });
        }
        await Mail.knex().table('mail').insert(values);

        return EmbedBuilder.build(this.msg, {
            title: 'Added',
            description: `Added ${this.amount} mail.`
        });
    }
}

module.exports = {
    options: options,
    class: AddMailCommand
}