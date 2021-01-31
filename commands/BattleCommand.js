const Command = require('./Command');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Battles = require('../knex/models/Battles');
const RocketPokemon = require('../knex/models/RocketPokemon');
const SelectTeamMenu = require('~/menus/SelectTeamMenu');

const options = {
    names: ['battle'],
    expectedParameters: [],
    global: true,
    menu: {
        class: SelectTeamMenu,
        parameters: {
            showInvalid: false, //don't show any dead, incomplete teams
        }
    },
}

class BattleCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        await Battles.query().delete();
        await RocketPokemon.query().delete();

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'battle/StartBattle' }
        ]);
    }
}

module.exports = {
    options: options,
    class: BattleCommand
}