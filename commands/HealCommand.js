const Command = require('./Command');
const Pokemon = require('~/knex/models/Pokemon');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

const options = {
    names: ['heal'],
    expectedParameters: [],
    global: true,
    ownerOnly: true
}

class HealCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        await Pokemon.query().update({
            hp: Pokemon.ref('maxHP')
        })
        .where('ownerId', this.msg.userId);

        return EmbedBuilder.build(this.msg, {
            title: 'Healed',
            description: 'Your Pokemon have been healed.'
        });
    }
}

module.exports = {
    options: options,
    class: HealCommand
}