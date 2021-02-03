var assert = require('assert');
const CommandRegistry = require('../CommandRegistry');
const MockMessage = require('../lib/MockMessage');
const DisplayCommand = require('~/commands/DisplayCommand');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
require('~/lib/Database');

describe('DisplayCommand', function() {
    let msg;
    let command;
    let response;
    let pokemon;

    before(async function() {
        msg = new MockMessage('!display');
        await CommandRegistry.setupMessage(msg);
        command = new DisplayCommand.class(msg);
    })
	describe('#validate', async function()  {
        it('should fail if no parameter given', async function() {
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'MISSING_PARAMETER');
            }
        })
        it('should fail for negative IDs', async function() {
            msg = new MockMessage('!display -1');
            await CommandRegistry.setupMessage(msg);
            command = new DisplayCommand.class(msg);
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'MISSING_PARAMETER');
            }
        })
        it('should fail if Pokemon ID not numeric', async function() {
            msg = new MockMessage('!display a');
            await CommandRegistry.setupMessage(msg);
            command = new DisplayCommand.class(msg);
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'MISSING_PARAMETER');
            }
        })
        it('should fail if invalid Pokemon ID given', async function() {
            msg = new MockMessage('!display 999');
            await CommandRegistry.setupMessage(msg);
            command = new DisplayCommand.class(msg);
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'NO_POKEMON');
            }
        })
    })
    describe('#run', function() {
        it('should return results for valid Pokemon', async function() {
            const pokemon = await PokemonCommands.getFirstPokemon(msg.userId);
            msg = new MockMessage(`!display ${pokemon.pokemonId}`);
            await CommandRegistry.setupMessage(msg);
            command = new DisplayCommand.class(msg);

            try {
                await command.validate();
                response = await command.run();
            }
            catch(e) {
                assert.fail();
            }
            assert(response.title == 'Level 1 bob');
        })
    })
})