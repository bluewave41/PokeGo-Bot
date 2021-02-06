var requireDir = require('require-dir');
const Server = require('./knex/models/Server');
const User = require('./knex/models/User');
const Colors = require('./data/Lists/ColorList');
const UserCommands = require('./data/ModelHandlers/UserCommands');
var commands = Object.values(requireDir('./commands')).filter(el => el.options);
const CustomError = require('~/lib/errors/CustomError');

async function parse(client, msg) {
    let command;
    
    try {
        command = await setupMessage(msg);
        if(!command) {
            return;
        }
        if(!msg.nextCommand && !command.options.global && !msg.gotStarter && !command.options.names.includes('starter')) {
            throw new CustomError('NO_STARTER');
        }
    }
    catch(e) {
        console.log(e);
        return { error: true, message: e.getMessage() }
    }

    if(msg.mentions.has(client.user.id) && !msg.mentions.everyone) {
        msg.reply(`My prefix is ${msg.prefix}.`)
        return;
    }

    if(!command) {
        return;
    }

    let response;

    try {
        command = new command.class(msg);
        await command.validate();
        response = await command.run();
    }
    catch(err) {
        console.log(err);
        return { error: true, message: err.getMessage() }
    }

    if(command.menu) { //this command shows a generic menu
        response = await command.menu.class.show(msg, command.menu.parameters);
    }

    return { command: command, message: response }
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
                await command.handleReactionAdd(reaction);
            }
        }
    }
}

async function init(msg) {
    //this one uses discordId so we can't use UserCommands
    let user = await User.query().select('userId', 'nextCommand', 'location', 'lastMessageId', 'gotStarter', 'team', 'admin')
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
        admin: user.admin
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

async function setupMessage(msg) {
    let command;

    await init(msg);

    //get prefix
    const prefix = await getPrefix(msg.guild.id);
    msg.prefix = prefix;

    if(msg.content.startsWith(prefix)) {
        const messageWithoutPrefix = msg.content.substring(prefix.length, msg.content.length);
        const split = messageWithoutPrefix.split(' ');
        command = commands.find(el => el.options.names.includes(split[0]));
        if(!command) {
            return null;
        }
        if(command.options.ownerOnly && !msg.admin) {
            throw new CustomError('NOT_ADMIN');
        }
        if(!command.options.global && msg.nextCommand) {
            throw new CustomError('INVALID_RESPONSE');
        }
        split.shift();
        msg.parameters = split;
    }
    else if(msg.nextCommand) {
        msg.parameters = msg.content.split(' ');
        command = require('./commands/' + msg.nextCommand);
    }

    if(!command) {
        return null;
    }

    return command;
}

module.exports = {
    parse,
    parseReactions,
    setupMessage,
}