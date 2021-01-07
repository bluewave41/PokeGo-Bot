const assert = require('assert');
const axios = require('./axios');
const { MessageEmbed } = require('discord.js');
const CommandParser = require('../CommandParser');
const Message = require('./Message');

describe('StarterCommand', function() {
	beforeEach(async function() {
		await axios.post(process.env.url + 'owner/reset', {userId: 1000});
	});
	
	it('Should return a list of starters', async function() {
		let message = new Message('>starter');
        let response = await CommandParser.parse(message);
		assert(response.description == 'Select a Pokemon:');
	})
	it('Should return list with extra parameters', async function() {
		let message = new Message('>starter 1');
        let response = await CommandParser.parse(message);
		assert(response.description = 'Select a Pokemon:');
	})
	it('Should give a starter if one is specified', async function() {
		let message = new Message('>starter');
        let response = await CommandParser.parse(message);
		message = new Message('squirtle');
		response = await CommandParser.parse(message);
		assert(response.description == 'Congratulations! You obtained a level 1 Squirtle!');
		message = new Message('>list');
		response = await CommandParser.parse(message);
		console.log(response.description.split('\n'));
	})
})