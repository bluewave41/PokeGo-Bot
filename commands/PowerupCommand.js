const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PowerupBuilder = require('./powerup/PowerupBuilder');
const PowerupList = require('~/data/Lists/PowerupList');
const CustomError = require('../lib/errors/CustomError');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const CandyCommands = require('~/data/ModelHandlers/CandyCommands');
const Command = require('./Command');

const options = {
    names: ['powerup'],
    expectedParameters: [
        { name: 'pokemonId', type: ['number'], optional: false }
    ],
    nextCommand: 'powerup/PowerupResponse',
}

class PowerupCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        this.candy = await CandyCommands.getCandyForPokemon(this.msg.userId, this.pokemon.candyId);
        //TODO: get user level
        //check stardust
        //TODO: check pokemon level, max is 40
    }
    async run() {
        const powerupIndex = PowerupList.findIndex(el => el.level == this.pokemon.level);
        const nextLevel = PowerupList[powerupIndex+1];
    
        //first check if we can power them up once
        if(nextLevel.candy <= this.candy) {
            //user is able to powerup at least once
            let candyTotal = 0;
            let howManyLevels = 0;
    
            //calculate how many times we can power them up
            for(var i=powerupIndex+1;i<PowerupList.length;i++) {
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
            await UserCommands.update(this.msg.userId, [
                { rowName: 'saved', value: JSON.stringify(saved) }
            ]);

            const data = {
                pokemon: this.pokemon,
                candy: this.candy,
                requiredCandy: nextLevel.candy,
                nextLevel: nextLevel.level,
                newCP: this.pokemon.calculateNewCP(nextLevel.level),
                howManyLevels: howManyLevels
            }

            super.run();
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
