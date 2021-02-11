const RocketPokemon = require('~/knex/models/RocketPokemon');
const Command = require('../Command');
const Battles = require('../../knex/models/Battles');
const CustomError = require('../../lib/errors/CustomError');
const TeamListings = require('~/knex/models/TeamListings');
const SelectTeamMemberMenu = require('~/menus/SelectTeamMemberMenu');
const ShowBattleMenu = require('~/menus/ShowBattleMenu');
const WonBattleMenu = require('~/menus/WonBattleMenu');
const Battle = require('./Battle');
const Caught = require('~/knex/models/Caught');
const User = require('~/knex/models/User');
const { raw } = require('objection');

const options = {
    names: [],
    expectedParameters: [
        { name: 'action', type: 'string', optional: false },
        { name: 'turns', type: 'number', optional: true, default: 1 }
    ],
    canQuit: true,
    info: 'In a battle'
}

//fast, charge, switch

class SimulateTurn extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        switch(this.action) {
            case 'f':
            case 's':
            case 'c':
                return true;
            default:
                throw new CustomError('INVALID_BATTLE_ACTION');
        }
    }
    async quit() {
        //remove battle
        //remove rocket pokemon
        //clear energy, delay, etc
        const battle = await Battles.query().select('teamId')
            .where('userID', this.msg.userId)
            .first();
        await Battles.query().delete()
            .where('userId', this.msg.userId);
        await RocketPokemon.query().delete()
            .where('userId', this.msg.userId);
        await TeamListings.query().update({
            energy: 0,
            delay: 0
        })
        .where('userId', this.msg.userId)
        .where('teamId', battle.teamId);
    }
    async run() {
        //the message was f s or c
        this.msg.delete();
        const battle = new Battle(this.msg);
        await battle.create();

        if(this.action == 'c') { //just in case the user tries to do multiple charge attacks
            this.turns = 1;
        }

        for(var i=0;i<this.turns;i++) {
            const response = await battle.handleTurn(this.action);
            if(battle.menu) {
                this.menu = battle.menu;
                await User.setNextCommand(this.msg.userId, 'battle/UseShield');
                return;
            }
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
            else if(response.switch) {
                if(battle.getAdjustedTimeout() > 0) {
                    throw new CustomError('TOO_EARLY_TO_SWITCH');
                }
                this.menu = {
                    class: SelectTeamMemberMenu,
                    parameters: {
                        title: 'Switch Pokemon',
                        description: 'Select a new Pokemon for battle',
                        team: battle.getTeam()
                    }
                }
                await User.setNextCommand(this.msg.userId, 'battle/SwitchPokemon');
                return;
            }
            if(response.rocket) {
                let nextRocketPokemon = battle.rocketTeam.find(el => el.hp > 0);
                if(!nextRocketPokemon) {
                    await User.reset(this.msg.userId);
                    await Caught.query().insert({
                        userId: this.msg.userId,
                        encounterId: battle.rocketId
                    });

                    //open shadow catching screen
                    await User.query().update({
                        nextCommand: 'reward/StartEncounter',
                        rocketWinCount: raw('rocketWinCount + 1')
                    })
                    .where('userId', this.msg.userId);

                    this.menu = {
                        class: WonBattleMenu,
                    }
                }
                else {
                    this.menu = {
                        class: ShowBattleMenu,
                        parameters: {
                            generate: true,
                            title: battle.rocketPokemon.name + ' fainted!',
                            p1: battle.playerPokemon,
                            p2: battle.rocketTeam.find(el => el.hp > 0)
                        }
                    }
                }
                return;
            }
        }

        let description = 'Battle';

        let timeout = battle.getAdjustedTimeout();

        if(timeout > 0) {
            description = `Can't switch for ${timeout}.`
        }

        this.menu = {
            class: ShowBattleMenu,
            parameters: {
                generate: false,
                title: 'Battle',
                description: description,
                p1: battle.playerPokemon,
                p2: battle.rocketTeam.find(el => el.hp > 0),
                p1Shields: battle.playerShields,
                p2Shields: battle.rocketShields,
            }
        }

        return;
    }
}

module.exports = {
    options: options,
    class: SimulateTurn
}