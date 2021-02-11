const Command = require('../Command');
const Battle = require('./Battle');
const User = require('~/knex/models/User');
const SelectTeamMemberMenu = require('~/menus/SelectTeamMemberMenu');
const ShowBattleMenu = require('~/menus/ShowBattleMenu');

const options = {
    names: [],
    expectedParameters: [
        { name: 'confirmation', type: 'string', possible: ['y', 'n', 'yes', 'no'], optional: false }
    ],
    info: 'Using a shield in battle'
}

/*This only gets called if the user has shields to use*/
class UseShield extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const battle = new Battle(this.msg);
        await battle.create();

        let response;

        if(this.confirmation.startsWith('y')) {
            response = battle.handleRocketDamage(true, true);
            this.usedShield = true;
        }
        else {
            response = battle.handleRocketDamage(true, false);
        }
        //is the player dead?
        if(response.player) {
            this.menu = {
                class: SelectTeamMemberMenu,
                parameters: {
                    title: battle.playerPokemon.name + ' fainted!',
                    description: 'Select a new Pokemon for battle',
                    team: battle.getTeam()
                }
            }
            await User.setNextCommand(this.msg.userId, 'battle/SwitchPokemon');
            return;
        }
        else {
            await User.setNextCommand(this.msg.userId, 'battle/SimulateTurn');
        }

        //unsure if this one is needed
        await battle.updateFields();

        this.menu = {
            class: ShowBattleMenu,
            parameters: {
                generate: this.usedShield,
                title: 'Battle',
                description: 'Battle',
                p1: battle.playerPokemon,
                p2: battle.rocketPokemon,
                p1Shields: battle.playerShields,
                p2Shields: battle.rocketShields,
            }
        }
    }
}

module.exports = {
    options: options,
    class: UseShield,
}