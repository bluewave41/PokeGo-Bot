const Command = require('../Command');
const RocketPokemon = require('~/knex/models/RocketPokemon');
const PokedexCommands = require('~/data/ModelHandlers/PokedexCommands');
const User = require('~/knex/models/User');
const EncounterBuilder = require('~/data/Builders/EncounterBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PlayerEncounters = require('~/knex/models/PlayerEncounters');
const TypeList = require('~/data/Lists/TypeList');
const ItemHandler = require('~/lib/ItemHandler');
const Battles = require('~/knex/models/Battles');
const User = require('~/knex/models/User');
const TeamListings = require('~/knex/models/TeamListings');

const options = {
    names: [],
    expectedParameters: [],
}

class StartEncounter extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
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
        const user = await User.query().select('secretId')
            .withGraphFetched('medals')
            .where('userId', this.msg.userId).first();

        const pokemon = await RocketPokemon.query().select('pokedexId', 'cp', 'hp', 'hpiv', 'atkiv', 'defiv', 'fastMove', 'chargeMove', 'level', 'gender', 'shadow') 
            .where('userId', this.msg.userId)
            .first();

        await PokedexCommands.insert(this.msg.userId, pokemon.pokedexId, false);

        pokemon.hp = pokemon.maxHP;
        pokemon.level = 8;

        //add encounter data to the pokemon
        pokemon.userId = this.msg.userId;
        pokemon.candyEarned = pokemon.catchCandy;
        pokemon.activePokeball = 16; //premier ball
        pokemon.medalMultiplier = calculateMedalMultiplier(pokemon, user.medals);
        //pokemon.shiny = pokemon.shinyId == user.secretId; FIX 
        pokemon.shiny = false;
        pokemon.cp = pokemon.calculateNewCP(pokemon.level);
        pokemon.hp = pokemon.calculateHP(pokemon.level);
        pokemon.premierBalls = 6; //testing

        const insertedEncounter = await PlayerEncounters.query().insert(pokemon);
        
        const circleColor = insertedEncounter.catchChance;

        const premierBall = ItemHandler.getItem(16);
        premierBall.amount = 6;
        premierBall.active = true;

        const data = {
            pokemon: pokemon,
            pokeBalls: [premierBall],
            position: 1,
            catchChance: circleColor,
            type: 'pokemon'
        }

        await this.quit();

        await User.setNextCommand(this.msg.userId, 'encounter/SelectSquare');

        const embed = EncounterBuilder.build(this.msg, data);
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: StartEncounter,
}

function calculateMedalMultiplier(pokemon, medals) {
    const types = pokemon.types;
    const type1 = TypeList[types[0]];
    const type2 = TypeList[types[1]] || null;

    let type1Medal = medals.find(el => el.medalId == type1);
    let type2Medal;
    if(type1Medal) {
        type1Medal = type1Medal.multiplier;
    }
    else {
        type1Medal = 1;
    }
    if(type2) {
        type2Medal = medals.find(el => el.medalId == type2);
        if(type2Medal) {
            type2Medal = type2Medal.multiplier;
        }
        else {
            type2Medal = 1;
        }
    }

    let multiplier = 1;

    //calculate average
    if(type1Medal && type2Medal) {
        multiplier *= (type1Medal + type2Medal) / 2;
    }
    //pokemon only has 1 type
    else {
        multiplier *= type1Medal;
    }

    return multiplier;
}