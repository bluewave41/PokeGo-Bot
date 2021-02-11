const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PowerupBuilder = require('./PowerupBuilder');
const Command = require('../Command');
const PowerupList = require('~/data/Lists/PowerupList');
const CandyCommands = require('../../data/ModelHandlers/CandyCommands');
const PokemonCommands = require(`~/data/ModelHandlers/PokemonCommands`);
const CustomError = require('../../lib/errors/CustomError');
const Pokemon = require('../../knex/models/Pokemon');
const Powerups = require(`~/knex/models/Powerups`);
const User = require('~/knex/models/User');

const options = {
    names: [],
    expectedParameters: [
        { name: 'response', type: ['number', 'string'], optional: false }
    ],
    canQuit: true,
    info: 'Powering up a Pokemon'
}

class PowerupResponse extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async quit() {
        await Powerups.query().delete()
            .where('userId', this.msg.userId);
    }
    async run() {
        const user = await User.query().select('saved')
            .where('userId', this.msg.userId);
        const saved = user.json;

        const pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, saved.pokemonId);
        const candy = await CandyCommands.getCandyForPokemon(this.msg.userId, pokemon.candyId);

        if(typeof this.response == 'number') { //user chose a new level
            if(this.response > saved.maximumTimes) { //user chose a level higher than they can do
                //TODO: implement player level limit
                throw new CustomError('LEVEL_TOO_HIGH', saved.maximumTimes);
            }
            const currentPowerupRow = PowerupList.findIndex(el => el.level == pokemon.level);
            const newLevel = currentPowerupRow + this.response;
            const nextPowerupRow = PowerupList[newLevel];
    
            const group = PowerupList.slice(currentPowerupRow, newLevel); //take the next 
            const powerupCost = group.reduce((acc, cur) => acc+cur.candy, 0);
    
            //update saved table
            //update saved variable
            saved.requiredCandy = powerupCost;
            saved.times = this.response;

            await User.query().update({
                saved: JSON.stringify(saved)
            })
            .where('userId', this.msg.userId);

            const data = {
                pokemon: pokemon,
                candy: candy,
                requiredCandy: powerupCost,
                nextLevel: nextPowerupRow.level,
                newCP: pokemon.calculateNewCP(nextPowerupRow.level),
                howManyLevels: saved.maximumTimes,
            }

            return EmbedBuilder.edit(this.msg, PowerupBuilder.build(this.msg, data));
        }
        else if(typeof this.response == 'string' && this.response.toLowerCase() == 'confirm') {
            //edit pokemon
            let powerupRow = PowerupList.findIndex(el => el.level == pokemon.level);
            powerupRow += saved.times;
            powerupRow = PowerupList[powerupRow];

            const maxHP = pokemon.calculateHP(powerupRow.level); //new maxHP

            await Pokemon.query().update({
                cp: pokemon.calculateNewCP(powerupRow.level),
                hp: pokemon.hp + (maxHP - pokemon.maxHP),
                maxHP: maxHP,
                level: powerupRow.level,
            })
            .where('pokemonId', pokemon.pokemonId);

            await User.reset(this.msg.userId);

            await CandyCommands.removeCandy(this.msg.userId, pokemon.candyId, saved.requiredCandy);
        
            //implement stardust cost
            const embed = {
                title: 'Powered up!',
                description: `${pokemon.name} rose from level ${pokemon.level} to ${powerupRow.level}!`,
                image: pokemon.url,
            }

            return EmbedBuilder.build(this.msg, embed);
        }
        else {
            throw new CustomError('INVALID_RESPONSE');
        }
    }
}

module.exports = {
    options: options,
    class: PowerupResponse
}