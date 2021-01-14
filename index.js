require('dotenv').config();
require('app-module-path').addPath(__dirname);
const Discord = require('discord.js');
const client = new Discord.Client();
const CommandParser = require('./CommandParser');
const axios = require('axios');
const SocketServer = require('./SocketServer');
const CommandRegistry = require('./CommandRegistry');
const UserCommands = require('./data/ModelHandlers/UserCommands');

axios.defaults.headers.post['errors'] = 'discord';
axios.defaults.headers.post['client'] = 'discord';

const server = new SocketServer(client);

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
	if(msg.author.bot) {
		return;
	}
    let message = await CommandRegistry.parse(msg);
    if(!message) {
        return;
    }
    if(message.error) {
        await msg.channel.send(message.message);
    }
    else {
        //TODO: delete the message?
        let response = await msg.channel.send(message);
        await UserCommands.update(msg.userId, [
            { rowName: 'lastMessageId', value: response.id }
        ]);
    }
});

client.login(process.env.token);