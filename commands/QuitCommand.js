const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const CustomError = require('~/lib/errors/CustomError');
const Command = require('./Command');

const options = {
    names: ['quit'],
    expectedParameters: [],
    global: true,
}

class QuitCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        if(!this.msg.nextCommand) {
            throw new CustomError('NON_QUITTABLE');
        }
    }
    async run() {
        let command = require(`./${this.msg.nextCommand}`);
        let embed;
        if(command.options.canQuit) {
            command = new command.class(this.msg);
            if(command.quit) {
                await command.quit();
            }
        }
        else {
            throw new CustomError('NON_QUITTABLE');
        }

        if(command.menu) { //this command shows a generic menu
            embed = await command.menu.class.show(this.msg, command.menu.parameters);
            return EmbedBuilder.edit(this.msg, embed);
        }

        await UserCommands.reset(this.msg.userId);

        embed = {
            title: 'Quit',
            description: `You quit.`
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: QuitCommand
}