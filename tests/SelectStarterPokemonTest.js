var assert = require('assert');
const CommandRegistry = require('../CommandRegistry');
const MockMessage = require('../lib/MockMessage');
const SelectStarterPokemon = require('~/commands/starter/SelectStarterPokemon');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
require('~/lib/Database');

describe('SelectStarterPokemon', function() {
    let msg;
    let command;
    let response;

    before(async function() {
        msg = new MockMessage();
        await CommandRegistry.setupMessage(msg);
        command = new SelectStarterPokemon.class(msg);
    })
	describe('#validate', function() {
        it('should fail if no parameter given', async function() {
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'MISSING_PARAMETER');
            }
        })
    })
	describe('#run', async function()  {
        it('should fail for invalid names', async function() {
            msg = new MockMessage('bob');
            await CommandRegistry.setupMessage(msg);
            command = new SelectStarterPokemon.class(msg);
            await command.validate();

            try {
                response = await command.run();
            }
            catch(e) {
                assert(e.message == 'INVALID_STARTER');
            }
        })
        it('should give Pokemon if name valid', async function() {
            msg = new MockMessage('squirtle');
            await CommandRegistry.setupMessage(msg);
            command = new SelectStarterPokemon.class(msg);
            await command.validate();

            try {
                response = await command.run();
                const pokemonCount = await PokemonCommands.getPokemonCount(msg.userId);
                assert(pokemonCount == 1);
            }
            catch(e) {
                assert.fail();
            }
        })
    })
})