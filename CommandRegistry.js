var requireDir = require('require-dir');
const Server = require('./knex/models/Server');
const User = require('./knex/models/User');
const Colors = require('./data/Lists/ColorList');
const UserCommands = require('./data/ModelHandlers/UserCommands');
var commands = Object.values(requireDir('./commands')).filter(el => el.options);
const CustomError = require('~/lib/errors/CustomError');
async function parse(client, msg) {
    await init(msg);
    const prefix = await getPrefix(msg.guild.id);
    msg.prefix = prefix;
    if(msg.mentions.has(client.user.id)) {
        msg.reply(`My prefix is ${prefix}.`)
        return;
    }
    //check for starter
    //global commands
    //next commands
    //regular command
    if(msg.content.startsWith(prefix)) { //user is running a command
        const messageWithoutPrefix = msg.content.substring(prefix.length, msg.content.length);
        const split = messageWithoutPrefix.split(' ');
        let command = commands.find(el => el.options.names.includes(split[0]));
        console.log(command)
        if(!command.options.global && msg.nextCommand) {
            const err = new CustomError('INVALID_RESPONSE');
            return { error: true, message: err.getMessage() }
        }
        if(command) { //user ran a valid command
            split.shift(); //remove the command
            msg.parameters = split;
            try {
                command = new command.class(msg); //create the command
                await command.validate();
                return { command: command, message: await command.run(msg) }; //run it
            }
            catch(err) {
                console.log(err);
                return { error: true, message: err.getMessage() }
            }
        }
    }
    else if(msg.nextCommand) { //user is in a menu
        msg.parameters = msg.content.split(' ');
        let command;
        try {
            command = require('./commands/' + msg.nextCommand);
            command = new command.class(msg);
            await command.validate();
            return { command: command, message: await command.run(msg) };
        }
        catch(err) {
            console.log(err);
            if(command.reset) {
                await UserCommands.reset(msg.userId);
            }
            return { error: true, message: err.getMessage() }
        }
    }
}

async function parseReactions(reaction, user) {
    let msg = { ...reaction.message } //copy the message here
    msg.author = user; //change the author 
    await init(msg);
    if(msg.nextCommand) {
        const { lastMessageId } = await UserCommands.getFields(msg.userId, ['lastMessageId']);
        if(lastMessageId == reaction.message.id) {
            let command = require('./commands/' + msg.nextCommand);
            command = new command.class(msg);
            if(command.handleReactionAdd) {
                await command.handleReactionAdd(reaction, msg);
            }
        }
    }
}

async function init(msg) {
    //this one uses discordId so we can't use UserCommands
    let user = await User.query().select('userId', 'nextCommand', 'location', 'lastMessageId', 'gotStarter', 'team')
        .where('discordID', msg.author.id).first();
    if(!user) {
        user = await User.query().insert({
            discordID: msg.author.id,
            username: msg.author.username,
            discriminator: msg.author.discriminator,
            currency: 500,
            stardust: 5000,
            secretId: Math.floor(Math.random() * 500) + 1,
        });
    }
    const info = {
        userId: user.userId,
        nextCommand: user.nextCommand,
        location: user.location,
        lastMessageId: user.lastMessageId,
        gotStarter: user.gotStarter,
        team: user.team,
        color: Colors[user.team],
    }
	Object.assign(msg, info);
}

async function getPrefix(guildId) {
    let server = await Server.query().select('prefix')
        .where('serverId', guildId)
        .first();
    if(!server) { //server doesn't exist
        server = await Server.query().insert({
            serverId: guildId,
            prefix: '!'
        }).first();
    }
    return server.prefix;
}

module.exports = {
    parse,
    parseReactions,
}