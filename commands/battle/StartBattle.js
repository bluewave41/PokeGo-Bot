const Command = require('../Command');
const Teams = require('~/knex/models/Teams');
const CustomError = require('~/lib/errors/CustomError');
const PokemonBuilder = require('~/lib/PokemonBuilder');
const Battles = require('~/knex/models/Battles');
const RocketPokemon = require('~/knex/models/RocketPokemon');
const ShowBattleMenu = require('~/menus/ShowBattleMenu');
const TeamListings = require('~/knex/models/TeamListings');
const Utils = require('~/lib/Utils');
const Rockets = require('~/knex/models/Rockets');
const User = require(`~/knex/models/User`);

const options = {
    names: [],
    expectedParameters: [
        { name: 'name', type: 'string', optional: false }
    ],
    canQuit: true,
    info: 'Selecting a team for battle'
}

class StartBattle extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        //reset team values
        await TeamListings.query().update({
            delay: 0,
            energy: 0,
            active: false,
         })
        .where('userId', this.msg.userId);

        this.team = await Teams.query().select('*')
            .withGraphJoined('pokemon')
            .where('player_teams.userId', this.msg.userId)
            .where('name', this.name)
            .first();

        //make sure their team has 3 Pokemon in it

        if(!this.team) {
            throw new CustomError('TEAM_NOT_FOUND');
        }
    }
    async run() {
        const user = await User.query().select('level', 'saved')
            .where('userID', this.msg.userId)
            .first();

        const saved = user.json;

        const rocket = await Rockets.query().select('*')
            .where('rocketId', saved.rocketId)
            .first();

        const p1 = PokemonBuilder.generateRocketPokemon(rocket.pokemon1, user.level);
        const p2 = PokemonBuilder.generateRocketPokemon(rocket.pokemon2, user.level);
        const p3 = PokemonBuilder.generateRocketPokemon(rocket.pokemon3, user.level);

        p1.userId = this.msg.userId;
        p2.userId = this.msg.userId;
        p3.userId = this.msg.userId;

        //insert pokemon
        await RocketPokemon.knex().table('rocket_pokemon').insert([
            p1.rocketInsert, p2.rocketInsert, p3.rocketInsert
        ]);

        //insert battle
        await Battles.query().insert({
            userId: this.msg.userId,
            teamId: this.team.teamId,
            rocketId: saved.rocketId,
            turnTimeout: 0,
        });

        await TeamListings.query().update({
            active: true,
        })
        .where('slot', 1)
        .where('userId', this.msg.userId)
        .where('teamId', this.team.teamId);

        //update command
        await User.setNextCommand(this.msg.userId, 'battle/SimulateTurn');

        this.menu = {
            class: ShowBattleMenu,
            parameters: {
                generate: true,
                title: 'Battle',
                description: 'Battle',
                p1: this.team.pokemon.find(el => el.slot == 1),
                p2: p1,
                p1Shields: 2,
                p2Shields: 2,
            }
        }
    }
}

module.exports = {
    options: options,
    class: StartBattle
}