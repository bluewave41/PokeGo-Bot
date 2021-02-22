require('dotenv').config();
require('app-module-path').addPath(__dirname);
const Discord = require('discord.js');
const client = new Discord.Client();
const SocketServer = require('./SocketServer');
const CommandRegistry = require('./CommandRegistry');
require('./lib/Database');
const User = require('~/knex/models/User');
const Logger = require('./Logger');

const server = new SocketServer(client);

console.clear();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
    console.log(client.guilds.cache.map(el => el.name));
});

client.on('message', async msg => {
	if(msg.author.bot) {
		return;
	}
    let message = await CommandRegistry.parse(client, msg);
    if(!message) {
        return;
    }
    if(!message.message) { //edits get trapped here
        if(message.command.afterSend) { //add emojis and stuff
            message.command.afterSend(msg.lastMessageId);
        }
        return;
    }
    if(message.error) {
        await msg.channel.send(message.message);
        return;
    }
    else {
        //TODO: delete the message?
        let response = await msg.channel.send(message.message);
        if(message.command.pagination) {
            await message.command.handlePagination(response.id);
        }
        await User.query().update({
            lastMessageId: response.id
        })
        .where('userId', msg.userId);
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    await CommandRegistry.parseReactions(reaction, user);
});

//On server add
client.on("guildCreate", guild => {
    Logger.info(`Joined: ${guild.name}`);
})

//On server leave
client.on("guildDelete", guild => {
    Logger.info(`Left: ${guild.name}`);
})

client.login(process.env.token);