const Caught = require("~/knex/models/Caught");
const CurrentEncounters = require("~/knex/models/CurrentEncounters");
const Pokestops = require("~/knex/models/Pokestops");
const Rockets = require("~/knex/models/Rockets");
const SpunPokestops = require("~/knex/models/SpunPokestops");

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

        return pokemon.concat(pokestops.concat(rockets));
    }
}