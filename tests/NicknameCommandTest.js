var assert = require('assert');
const CommandRegistry = require('../CommandRegistry');
const MockMessage = require('../lib/MockMessage');
const NicknameCommand = require('~/commands/NicknameCommand');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
require('~/lib/Database');

describe('NicknameCommand', function() {
    let msg;
    let command;
    let response;
    let pokemon;

    before(async function() {
        msg = new MockMessage('!nickname');
        await CommandRegistry.setupMessage(msg);
        command = new NicknameCommand.class(msg);
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
        it('should fail if longer than 20 characters', async function() {
            pokemon = await PokemonCommands.getFirstPokemon(msg.userId);
            msg = new MockMessage(`!nickname ${pokemon.pokemonId} hohohohohohohohohohoh`);
            await CommandRegistry.setupMessage(msg);
            command = new NicknameCommand.class(msg);

            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'INVALID_NAME_LENGTH');
            }
        })
        it('should fail if name contains symbols', async function() {
            msg = new MockMessage(`!nickname ${pokemon.pokemonId} @everyone`);
            await CommandRegistry.setupMessage(msg);
            command = new NicknameCommand.class(msg);

            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'INVALID_NICKNAME');
            }
        })
        it('should change name if valid', async function() {
            msg = new MockMessage(`!nickname ${pokemon.pokemonId} bob`);
            await CommandRegistry.setupMessage(msg);
            command = new NicknameCommand.class(msg);

            try {
                await command.validate();
                response = await command.run();
            }
            catch(e) {
                assert(e.message == 'INVALID_NICKNAME');
            }

            pokemon = await PokemonCommands.getFirstPokemon(msg.userId);
            assert(pokemon.name == 'bob');
        })
    })
})