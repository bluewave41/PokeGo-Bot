const Command = require('./Command');
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

        await User,query().update({
            nextCommand: 'battle/StartBattle'
        })
        .where('userId', this.msg.userId);
    }
}

module.exports = {
    options: options,
    class: BattleCommand
}