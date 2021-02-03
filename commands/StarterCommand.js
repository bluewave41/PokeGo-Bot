const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const StarterList = require('~/data/Lists/StartersList');
const Command = require('./Command');
const CustomError = require('../lib/errors/CustomError');

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
        const { gotStarter } = await UserCommands.getFields(this.msg.userId, 'gotStarter');
        if(gotStarter) {
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

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'starter/SelectStarterPokemon' }
        ]);
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: StarterCommand,
}