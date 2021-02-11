const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const StarterList = require('~/data/Lists/StartersList');
const Command = require('./Command');
const CustomError = require('../lib/errors/CustomError');
const User = require('~/knex/models/User');

const options = {
    names: ['starter'],
    expectedParameters: [],
}

class StarterCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        const user = await User.query().select('gotStarter')
            .where('userId', this.msg.userId)
            .first();
        if(user.gotStarter) {
            throw new CustomError('ALREADY_HAVE_STARTER');
        }
    }
    async run() {
        const starters = StarterList.map(el => [el[1], el[2], false]);

        let embed = {
            title: 'Starter',
            description: 'Select a Pokemon:',
            fields: starters,
        }

        await User.query().update({
            nextCommand: 'starter/SelectStarterPokemon'
        })
        .where('userID', this.msg.userId);

        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: StarterCommand,
}