const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PowerupBuilder = require('./powerup/PowerupBuilder');
const PowerupList = require('~/data/Lists/PowerupList');
const CustomError = require('../lib/errors/CustomError');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const CandyCommands = require('~/data/ModelHandlers/CandyCommands');
const Command = require('./Command');
const User = require('~/knex/models/User');
const Constants = require('~/lib/Constants');

const options = {
    names: ['powerup'],
    expectedParameters: [
        { name: 'pokemonId', type: ['number'], optional: false }
    ],
}

class PowerupCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        this.candy = await CandyCommands.getCandyForPokemon(this.msg.userId, this.pokemon.candyId);
        if(this.pokemon.level >= Constants.MAX_POKEMON_LEVEL) {
            throw new CustomError('MAX_POKEMON_LEVEL_REACHED');
        }
        //TODO: get user level
        //check stardust
    }
    async run() {
        const powerupIndex = PowerupList.findIndex(el => el.level == this.pokemon.level);
        const nextLevel = PowerupList[powerupIndex+1];
        const user = await User.query().select('level')
            .where('userId', this.msg.userId)
            .first();
    
        //first check if we can power them up once
        if(nextLevel.candy <= this.candy) {
            //user is able to powerup at least once
            let candyTotal = 0;
            let howManyLevels = 0;
    
            //calculate how many times we can power them up
            for(var i=powerupIndex+1;i<PowerupList.length;i++) {
                //only allow Pokemon to be leveled to your level + 2
                if(PowerupList[i].level > user.level+2) {
                    break;
                }
                candyTotal += PowerupList[i].candy;
                howManyLevels++;
                if(candyTotal >= this.candy) {
                    break;
                }
            }
            const saved = {
                pokemonId: this.pokemon.pokemonId,
                maximumTimes: howManyLevels,
                requiredCandy: nextLevel.candy,
                times: 1,
            }

            await User.query().update({
                saved: JSON.stringify(saved)
            })
            .where('userId', this.msg.userId);

            const data = {
                pokemon: this.pokemon,
                candy: this.candy,
                requiredCandy: nextLevel.candy,
                nextLevel: nextLevel.level,
                newCP: this.pokemon.calculateNewCP(nextLevel.level),
                howManyLevels: howManyLevels
            }

            await User.setNextCommand(this.msg.userId, 'powerup/PowerupResponse');
            return EmbedBuilder.build(this.msg, PowerupBuilder.build(this.msg, data));
        }
        else {
            throw new CustomError('INSUFFICIENT_CANDY', PowerupList[powerupIndex+1].candy);
        }
    }
}

module.exports = {
    options: options,
    class: PowerupCommand
}
