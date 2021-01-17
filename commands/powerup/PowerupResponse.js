const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PowerupBuilder = require('./PowerupBuilder');
const Command = require('../Command');
const UserCommands = require('../../data/ModelHandlers/UserCommands');
const PowerupList = require('~/data/Lists/PowerupList');
const CandyCommands = require('../../data/ModelHandlers/CandyCommands');
const PokemonCommands = require(`~/data/ModelHandlers/PokemonCommands`);
const CustomError = require('../../lib/errors/CustomError');
const Pokemon = require('../../knex/models/Pokemon');

const options = {
    names: [],
    expectedParameters: [
        { name: 'response', type: ['number', 'string'], optional: false }
    ],
}

class PowerupResponse extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const saved = await UserCommands.getSaved(this.msg.userId);
        /*const saved = {
                pokemonId: this.pokemon.pokemonId,
                maximumTimes: howManyLevels,
                requiredCandy: nextLevel.candy
            }*/
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

            await UserCommands.update(this.msg.userId, [
                { rowName: 'saved', value: JSON.stringify(saved) }
            ]);

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

            await UserCommands.reset(this.msg.userId);

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

  /*

    if(Utils.isNumeric(response)) { //user chose a new level
        if(response > powerup.maximum_times) { //user chose a level higher than they can do
            //TODO: implement player level limit
            err = new CustomError('LEVEL_TOO_HIGH', powerup.maximum_times);
            res.json({ error: Errors.getError(err, req.headers.errors)});
            return res.end();
        }
        const currentPowerupRow = PowerupTable.findIndex(el => el.level == pokemon.level);
        const newLevel = currentPowerupRow + parseInt(response);
        const nextPowerupRow = PowerupTable[newLevel];

        const group = PowerupTable.slice(currentPowerupRow, newLevel); //take the next 
        const powerupCost = group.reduce((acc, cur) => acc+cur.candy, 0);

        //update saved table
        await Powerups.query().update({
            times: response,
            required_candy: powerupCost,
        })
        .where('userId', userId);

        res.json({ pokemon: pokemon, candy: candy, requiredCandy: powerupCost, nextLevel: nextPowerupRow.level,
            newCP: pokemon.calculateNewCP(nextPowerupRow.level), howManyLevels: powerup.maximum_times });
        return res.end();
    }
    else if(response == 'confirm') {
        //edit pokemon
        let powerupRow = PowerupTable.findIndex(el => el.level == pokemon.level);
        powerupRow += powerup.times;
        powerupRow = PowerupTable[powerupRow];

        const maxHP = pokemon.calculateHP(powerupRow.level); //new maxHP
        //pokemon actual HP is 

        await PokemonModel.query().update({
            cp: pokemon.calculateNewCP(powerupRow.level),
            hp: pokemon.hp + (maxHP - pokemon.maxHP),
            maxHP: maxHP,
            level: powerupRow.level,
        })
        .where('pokemonId', pokemon.pokemonId);

        await UserCommands.reset(userId);

        await Powerups.query().delete()
            .where('userId', userId);

        await CandyCommands.removeCandy(userId, pokemon.candyId, powerup.required_candy);

        
        //implement stardust cost
    }
    else if(response == 'quit') {
        await UserCommands.reset(userId);
        await Powerups.query().delete()
            .where('userId', userId);
        res.send({ quit: true });
        res.end();
    }
    else {
        err = new CustomError('INVALID_RESPONSE');
        res.json({ error: Errors.getError(err, req.headers.errors)});
    }
}*/