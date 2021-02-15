const Caught = require("~/knex/models/Caught");
const CurrentEncounters = require("~/knex/models/CurrentEncounters");
const Pokestops = require("~/knex/models/Pokestops");
const Rockets = require("~/knex/models/Rockets");
const SpunPokestops = require("~/knex/models/SpunPokestops");
const User = require('~/knex/models/User');

module.exports = {
    async getSprites(userId, location, secretId, level) {
        let pokemon = await CurrentEncounters.query().select('*')
            .whereNotIn(
                'encounterId', 
                Caught.query().select('encounterId')
                    .where('userId', userId)
            )
        .where('cell', location);

        pokemon.forEach(el => el.encounterType = 'pokemon');
    
        //get pokestops
        let pokestops = await Pokestops.query().select('*')
            .whereNotIn(
                'id',
                SpunPokestops.query().select('pokestopId')
                    .where('userId', userId)
            )
        .where('cell', location);

        //level 5 unlocks potions and revives so it's the minimum needed to show gyms
        if(level < 5) {
            pokestops = pokestops.filter(el => el.type != 1);
        }

        pokestops.forEach(el => el.encounterType = 'pokestop');

        let rockets = [];

        if(level >= 8) {
            rockets = await Rockets.query().select('*')
            .whereNotIn(
                'rocketId',
                Caught.query().select('encounterId')
                    .where('userId', userId)
            )
            .where('cell', location);

            rockets.forEach(el => el.encounterType = 'rocket');
        }

        //add shiny markers
        if(pokemon.length) {
            pokemon.forEach(function(pokemon) {
                if(pokemon.shinyId == secretId) {
                    pokemon.shiny = true;
                }
            });
        }

        const combined = pokemon.concat(pokestops.concat(rockets));
        if(!combined.length) {
            await User.reset(userId);
        }

        return combined;
    }
}