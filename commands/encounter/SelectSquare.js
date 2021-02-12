const EncounterBuilder = require('~/data/Builders/EncounterBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const PlayerEncounters = require('~/knex/models/PlayerEncounters');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const PowerupList = require('~/data/Lists/PowerupList');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Caught = require('~/knex/models/Caught');
const User = require('~/knex/models/User');
const Command = require('../Command');
const CustomError = require('~/lib/errors/CustomError');
const ItemHandler = require('~/lib/ItemHandler');

const options = {
    names: [],
    expectedParameters: [
        { name: 'toss', type: 'string', optional: false }
    ],
    canQuit: true,
    info: 'Catching a Pokemon'
}

class SelectSquare extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        if(!isValidToss(this.toss)) {
            throw new CustomError('INVALID_SQUARE');
        }
    }
    async quit() {
        await PlayerEncounters.query().delete()
            .where('userId', this.msg.userId);
    }
    async run() {
        //get the encounter
        const encounter = await PlayerEncounters.query().select('*')
            .where('userId', this.msg.userId).first();

        //user isn't in a reward encounter
        if(!encounter.premierBalls) {
            //check that we have the type of pokeball that we're using
            const { amount: pokeballCount } = await InventoryCommands.getItemCount(this.msg.userId, encounter.activePokeball);

            if(pokeballCount <= 0) {
                throw new CustomError('NO_POKEBALL_TYPE');
            }
        }

        let { pokemonPos } = encounter;

        //Determine whether or not the Pokemon moves
        pokemonPos = updatePokemonPosition(pokemonPos, encounter.canPokemonMove);

        let reply = {
            pokemon: encounter.pokemon,
        }

        let hitObject = doesBallHit(this.toss, pokemonPos);
        if(hitObject.hit) {
            if(tryToCatch(encounter.pokemon, hitObject.multiplier, encounter.multiplier)) {
                //add xp
                let xpGained = 200;
                switch(hitObject.multiplier) {
                    case 1.5:
                        xpGained = 300;
                        break;
                    case 2:
                        xpGained = 500;
                        break;
                }

                await UserCommands.addXP(this.msg.userId, xpGained);
                await User.reset(this.msg.userId);

                //don't insert shadows into this
                if(encounter.encounterId) {
                    await Caught.query().insert({
                        userID: this.msg.userId,
                        encounterId: encounter.encounterId,
                    });
                }

                //add pokemon
                const pokemon = await PokemonCommands.catchPokemon(this.msg.userId, encounter.pokemon, encounter.candyEarned);
            
                reply.flag = 'caught';
                reply.xpGained = xpGained;
                reply.catchDust = encounter.pokemon.catchDust;
                reply.catchCandy = encounter.candyEarned;
                reply.pokemonId = pokemon.pokemonId;
                reply.position = -1;
            }
            else {
                reply.flag = 'fail';
                reply.position = pokemonPos;
            }
        }
        else {
            reply.flag = 'missed';
            reply.position = pokemonPos;
        }

        if(reply.flag == 'caught') {
            await PlayerEncounters.query().delete()
                .where('userId', this.msg.userId);
        }
        else {
        //reset the item since the catching has finished and it isn't needed anymore
            await PlayerEncounters.query().update({
                item: null,
                candyEarned: encounter.pokemon.catchCandy,
                pokemonPos: pokemonPos,
            })
            .where('userID', this.msg.userId);
        }

        let pokeBalls;

        if(encounter.premierBalls) {
            await PlayerEncounters.query().decrement('premierBalls', 1);
            let premierBall = ItemHandler.getItem(16);
            premierBall.active = true;
            premierBall.amount = encounter.premierBalls-1;
            pokeBalls = [premierBall];
        }
        else {
            await InventoryCommands.removeItems(this.msg.userId, encounter.activePokeball, 1); //remove pokeball
            pokeBalls = await InventoryCommands.getPokeballs(this.msg.userId);
            let activePokeball = pokeBalls.find(el => el.itemId == encounter.activePokeball);
            //if the user has 1 pokeball and uses it then this fails. They should be prompted to swap poke balls
            if(activePokeball) {
                activePokeball.active = true;
            }
        }

        const totalPokeballs = pokeBalls.reduce((acc, { amount }) => acc + amount, 0);

        //User has no Pokeballs so we should force quit the encounter
        if(totalPokeballs <= 0) {
            await User.reset(this.msg.userId);

            await PlayerEncounters.query().delete()
                .where('userId', this.msg.userId);
        }

        reply.pokeBalls = pokeBalls;
        reply.catchChance = encounter.catchChance;

        let embed = EncounterBuilder.build(this.msg, reply);

        let message = this.msg.channel.messages.cache.get(this.msg.lastMessageId);
        if(message) {
            message.edit(EmbedBuilder.build(this.msg, embed));
        }
        else {
            return EmbedBuilder.build(this.msg, embed);
        }
    }
}

module.exports = {
    options: options,
    class: SelectSquare,
}

function isValidToss(toss) {
    switch(toss.toLowerCase()) {
        case 'l2':
        case 'l3':
        case 'r1':
        case 'r2':
        case 's1':
        case 's2':
        case 's3':
            return true;
    }
    return false;
}

/**
 * 50% chance to move the Pokemon to a different space
 * @param {Integer} pokemonPos current space the Pokemon is on. 0, 1 or 2.
 */
function updatePokemonPosition(pokemonPos, canPokemonMove) {
    if(!canPokemonMove) {
        return pokemonPos;
    }
    let random = Math.random();
    if(random < 0.5) {
        let possible = [];
        if(pokemonPos-1 >= 0) {
            possible.push(pokemonPos-1);
        }
        if(pokemonPos+1 <= 2) {
            possible.push(pokemonPos+1);
        }
        pokemonPos = possible[Math.floor(Math.random() * possible.length)];
    }
    return pokemonPos;
}

function doesBallHit(square, pokemonPos) {
    let curve = square[0].toLowerCase();
    let tile = square[1]-1;
    
    if(curve == 's' && pokemonPos == tile) { //excellent
        return {hit: true, multiplier: 2};
    }
    else if(curve == 'l') {
        if(tile == pokemonPos) {
            return {hit: true, multiplier: 1.5};
        }
        else if(tile-1 == pokemonPos) {
            return {hit: true, multiplier: 1}
        }
        return {hit: false}
    }
    else if(curve == 'r') {
        if(tile == pokemonPos) {
            return {hit: true, multiplier: 1.5}
        }
        else if(tile+1 == pokemonPos) {
            return {hit: true, multiplier: 1}
        }
        return {hit: false}
    }
    else {
        return {hit: false}
    }
}

/*This is here because we need to include the hit object multiplier in the calculation but that doesn't get
  sent to the user.*/
function determineCircleColor(pokemon, multiplier) {
    let chance;
    const catchRate = pokemon.captureRate/100;
    const row = PowerupList.find(el => el.level == pokemon.level);
    chance = catchRate / (row.multiplier * 2);
    if(chance > 1) {
        return 100;
    }
    chance = 1 - chance;
    chance = Math.pow(chance, multiplier);
    chance = 1 - chance;
    return chance;
}

function tryToCatch(pokemon, hitObjectMultiplier, multiplier) {
    const chance = determineCircleColor(pokemon, (hitObjectMultiplier * multiplier));
    const percent = Math.random();
    return percent < chance;
}