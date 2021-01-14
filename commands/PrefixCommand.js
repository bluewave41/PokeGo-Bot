const CustomError = require('~/lib/errors/CustomError');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Server = require('~/knex/models/Server');
const Command = require('./Command');

const options = {
    names: ['prefix'],
    expectedParameters: [
        { name: 'prefix', type: 'string', optional: false }
    ],
}

class PrefixCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        if(!this.msg.member.hasPermission('MANAGE_GUILD')) {
            throw new CustomError('NO_PERMISSION', 'manage guild');
        }
        if(this.prefix.length > 3) {
            throw new CustomError('INVALID_PREFIX_LENGTH');
        }
    }
    async run() {
        const newPrefix = this.msg.parameters[0];

        await Server.query().update({
            prefix: newPrefix
        })
        .where('serverId', this.msg.guild.id);

        const embed = {
            title: 'Prefix Changed',
            description: `This servers prefix has been changed to ${newPrefix}.`
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: PrefixCommand,
}