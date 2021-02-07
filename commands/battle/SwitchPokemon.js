const Command = require('../Command');
const Battles = require('~/knex/models/Battles');
const CustomError = require('~/lib/errors/CustomError');
const TeamListings = require('~/knex/models/TeamListings');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const ShowBattleMenu = require('~/menus/ShowBattleMenu');

const options = {
    names: [],
    expectedParameters: [
        { name: 'slot', type: 'number', optional: false, max: 3 }
    ],
    canQuit: true,
    info: 'Switching Pokemon in battle'
}

class SwitchPokemon extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async setup() {
        this.battle = await Battles.query().select('*')
            .withGraphFetched('playerTeam.[pokemon]')
            .withGraphFetched('rocketTeam')
            .modifyGraph('rocketTeam', builder => {
                builder.whereNot('hp', 0).limit(1)
            })
            .where('userId', this.msg.userId)
            .first();
    }
    async validate() {
        super.validate();
        await this.setup();

        this.pokemon = this.battle.playerTeam.pokemon.find(el => el.slot == this.slot);
        if(this.pokemon.active) {
            throw new CustomError('POKEMON_ALREADY_OUT');
        }
        if(this.pokemon.hp <= 0) {
            throw new CustomError('SELECTED_FAINTED_POKEMON');
        }
    }
    async quit() {
        await this.setup();
        const pokemon = this.battle.playerTeam.pokemon.find(el => el.active);
        if(pokemon.hp <= 0) {
            throw new CustomError('FAINTED_POKEMON');
        }
        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'battle/SimulateTurn' }
        ]);

        this.menu = {
            class: ShowBattleMenu,
            parameters: {
                generate: true,
                title: 'Battle',
                description: 'Battle',
                p1: pokemon,
                p2: this.battle.rocketTeam[0],
                p1Shields: this.battle.playerShields,
                p2Shields: this.battle.rocketShields,
            }
        }
    }
    async run() {
        const rocketPokemon = this.battle.rocketTeam[0];
        let battleString = 'Battle';

        //update active field
        await TeamListings.query().update({
            active: false
        })
        .where('teamId', this.battle.teamId);

        await TeamListings.query().update({
            active: true
        })
        .where('teamId', this.battle.teamId)
        .where('pokemonId', this.pokemon.pokemonId);

        //set timeout for switching
        if(this.battle.playerTeam.pokemon.find(el => el.active).hp != 0) {
            battleString = `Can't switch for 60000.`;
            await Battles.query().update({
                turnTimeout: 60000,
            })
            .where('userId', this.msg.userId);
        }

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'battle/SimulateTurn' }
        ]);

        this.menu = {
            class: ShowBattleMenu,
            parameters: {
                generate: true,
                title: 'Battle',
                description: battleString,
                p1: this.pokemon,
                p2: rocketPokemon,
                p1Shields: this.battle.playerShields,
                p2Shields: this.battle.rocketShields,
            }
        }
    }
}

module.exports = {
    options: options,
    class: SwitchPokemon
}