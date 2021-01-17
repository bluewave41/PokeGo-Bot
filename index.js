require('dotenv').config();
require('app-module-path').addPath(__dirname);
const Discord = require('discord.js');
const client = new Discord.Client();
const SocketServer = require('./SocketServer');
const CommandRegistry = require('./CommandRegistry');
const UserCommands = require('./data/ModelHandlers/UserCommands');
require('./lib/Database');

const server = new SocketServer(client);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
	if(msg.author.bot) {
		return;
	}
    let message = await CommandRegistry.parse(client, msg);
    if(!message.message) { //edits get trapped here
        if(message.command.afterSend) {
            message.command.afterSend(msg.lastMessageId);
        }
        return;
    }
    if(message.error) {
        await msg.channel.send(message.message);
    }
    else {
        //TODO: delete the message?
        let response = await msg.channel.send(message.message);
        if(message.command.afterSend) {
            await message.command.afterSend(response.lastMessageId);
        }
        await UserCommands.update(msg.userId, [
            { rowName: 'lastMessageId', value: response.id }
        ]);
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    await CommandRegistry.parseReactions(reaction, user);
});

client.login(process.env.token);