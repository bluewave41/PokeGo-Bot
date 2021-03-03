const EmbedBuilder = require('../data/Builders/EmbedBuilder');
const Command = require('./Command');
const CustomError = require('~/lib/errors/CustomError');
const CurrentEncounters = require('~/knex/models/CurrentEncounters');
const User = require('~/knex/models/User');

const options = {
    names: ['showShiny'],
    expectedParameters: [],
    ownerOnly: true
}

class ShowShinyCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {

    }
    async run() {
        let mentionedUser = this.msg.mentions.users.first();
        if(!mentionedUser) {
            throw new CustomError('NO_MENTION');
        }
        const user = await User.query().select('secretId')
            .findOne('discordId', mentionedUser.id);
        
        const shinies = await CurrentEncounters.query().select('cell', 'pokedexId')
            .where('shinyId', user.secretId);

        let description = '';
        
        for(var i=0;i<shinies.length;i++) {
            description += shinies[i].cell + ': ' + shinies[i].originalName + '\n';
        }

        return EmbedBuilder.build(this.msg, {
            title: 'Shinies',
            description: description
        });
    }
}

module.exports = {
    options: options,
    class: ShowShinyCommand,
}