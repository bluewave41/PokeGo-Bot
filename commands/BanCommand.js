const Command = require('./Command');
const User = require('~/knex/models/User');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

const options = {
    names: ['ban'],
    expectedParameters: [
        { name: 'id', type: ['number', 'string'], optional: false, asType: 'string' }
    ],
    ownerOnly: true,
}

class BanCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const result = await User.query().update({
            banned: true
        })
        .where('discordId', this.id);

        if(result) {
            return EmbedBuilder.build(this.msg, {
                title: 'Banned',
                description: 'User has been banned.'
            });
        }
        else {
            return EmbedBuilder.build(this.msg, {
                title: 'Failed',
                description: 'User was not found.'
            });
        }
    }
}

module.exports = {
    options: options,
    class: BanCommand,
}