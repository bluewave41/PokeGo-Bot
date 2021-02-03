var assert = require('assert');
const CommandRegistry = require('../CommandRegistry');
const MockMessage = require('../lib/MockMessage');
const StarterCommand = require('~/commands/StarterCommand');
const User = require('~/knex/models/User');
require('~/lib/Database');

describe('StarterCommand', function() {
    let msg;
    let command;
    let response;

    before(async function() {
        await User.query().delete()
            .where('username', 'tester');
        msg = new MockMessage();
        await CommandRegistry.setupMessage(msg);
        command = new StarterCommand.class(msg);
    })
	describe('#validate', function() {
        it('should fail if we have a starter', async function() {
            await User.query().update({
                gotStarter: true
            })
            .where('userId', msg.userId);
            try {
                await command.validate();
            }
            catch(e) {
                assert(e.message == 'ALREADY_HAVE_STARTER');
            }
        })
    })
	describe('#run', async function()  {
        it('should run without errors', async function() {
            response = await command.run();
        })
        it('should set next command', async function() {
            const field = await User.query().select('nextCommand')
                .where('userId', msg.userId)
                .first();
            assert(field.nextCommand == 'starter/SelectStarterPokemon');
        });
        it('should provide response', function() {
            assert(response.fields.length == 3);
        })
    })
})

/*--- tests.js ---
require('./test/one.js')
require('./test/two.js')
require('./test/three.js')*/