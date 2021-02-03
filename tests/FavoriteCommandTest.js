var assert = require('assert');
const CommandRegistry = require('../CommandRegistry');
const MockMessage = require('../lib/MockMessage');
const FavoriteCommand = require('~/commands/FavoriteCommand');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
require('~/lib/Database');

describe('FavoriteCommand', function() {
    let msg;
    let command;
    let response;
    let pokemon;

	describe('#validate', async function()  {
        it('should fail if no parameter given', async function() {
            msg = new MockMessage('!favorite');
            await CommandRegistry.setupMessage(msg);
            command = new FavoriteCommand.class(msg);
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'MISSING_PARAMETER');
            }
        })
        it('should fail for negative IDs', async function() {
            msg = new MockMessage('!favorite -1');
            await CommandRegistry.setupMessage(msg);
            command = new FavoriteCommand.class(msg);
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'MISSING_PARAMETER');
            }
        })
        it('should fail if Pokemon ID not numeric', async function() {
            msg = new MockMessage('!favorite a');
            await CommandRegistry.setupMessage(msg);
            command = new FavoriteCommand.class(msg);
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'MISSING_PARAMETER');
            }
        })
        it('should fail if invalid Pokemon ID given', async function() {
            msg = new MockMessage('!favorite 999');
            await CommandRegistry.setupMessage(msg);
            command = new FavoriteCommand.class(msg);
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'NO_POKEMON');
            }
        })
    })
    describe('#run', function() {
        it('should make favorite', async function() {
            pokemon = await PokemonCommands.getFirstPokemon(msg.userId);
            msg = new MockMessage(`!favorite ${pokemon.pokemonId}`);
            await CommandRegistry.setupMessage(msg);
            command = new FavoriteCommand.class(msg);

            try {
                await command.validate();
                response = await command.run();
            }
            catch(e) {
                assert.fail();
            }
            assert(response.description == 'bob was added to your favorites list!');
        })
        it('should remove favorite', async function() {
            msg = new MockMessage(`!favorite ${pokemon.pokemonId}`);
            await CommandRegistry.setupMessage(msg);
            command = new FavoriteCommand.class(msg);

            try {
                await command.validate();
                response = await command.run();
            }
            catch(e) {
                assert.fail();
            }
            assert(response.description == 'bob was removed from your favorites list!');
        })
    })
})