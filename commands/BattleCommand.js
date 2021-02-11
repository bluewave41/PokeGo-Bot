const Command = require('./Command');
const Battles = require('../knex/models/Battles');
const RocketPokemon = require('../knex/models/RocketPokemon');
const SelectTeamMenu = require('~/menus/SelectTeamMenu');
const User = require('~/knex/models/User');

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

        await User.setNextCommand(this.msg.userId, 'battle/StartBattle');
    }
}

module.exports = {
    options: options,
    class: BattleCommand
}