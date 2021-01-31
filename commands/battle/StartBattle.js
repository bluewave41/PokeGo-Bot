const Command = require('../Command');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Teams = require('~/knex/models/Teams');
const CustomError = require('~/lib/errors/CustomError');
const PokemonBuilder = require('~/lib/PokemonBuilder');
const Battles = require('~/knex/models/Battles');
const RocketPokemon = require('~/knex/models/RocketPokemon');
const ShowBattleMenu = require('~/menus/ShowBattleMenu');
const TeamListings = require('~/knex/models/TeamListings');

const options = {
    names: [],
    expectedParameters: [
        { name: 'name', type: 'string', optional: false }
    ],
    canQuit: true,
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
        //create Pokemon (can't do this in server because Pokemon need to be associated with the user)

        const p1 = PokemonBuilder.generateRocketPokemon(96, 40);
        const p2 = PokemonBuilder.generateRocketPokemon(4, 40);
        const p3 = PokemonBuilder.generateRocketPokemon(7, 40);
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
            rocketId: 1, //DEBUG
            turnTimeout: 0,
        });

        await TeamListings.query().update({
            active: true,
        })
        .where('slot', 1)
        .where('userId', this.msg.userId)
        .where('teamId', this.team.teamId);

        //update command
        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'battle/SimulateTurn' }
        ]);

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