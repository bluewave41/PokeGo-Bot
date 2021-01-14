const Pokedex = require("~/knex/models/Pokedex");
const { raw, UniqueViolationError } = require('objection');

module.exports = {
    /**
     * Inserts an entry into the Pokedex table or creates it if it doesn't already exist.
     * @param {Integer} userId msg.userId 
     * @param {Integer} pokedexId Pokedex ID of the Pokemon
     * @param {Boolean} caught Flag for whether the Pokemon was caught or not. 
     */
    async insert(userId, pokedexId, caught) {
        try {
            /*Inserting will only ever happen if it doesn't already exist
              which means the user encountered a Pokemon and seen should be 1
            */
            await Pokedex.query().insert({
                userId: userId,
                pokedexId: pokedexId,
                seen: 1,
                caught: 0,
            });
        }
        catch(err) { //the row already exists
            if(err instanceof UniqueViolationError) {
                if(caught) {
                    await Pokedex.query().update({
                        caught: raw('caught + 1')
                    })
                    .where('userId', userId)
                    .where('pokedexId', pokedexId);
                }
                else {
                    await Pokedex.query().update({
                        seen: raw('seen + 1')
                    })
                    .where('userId', userId)
                    .where('pokedexID', pokedexId);
                }
            }
        }
    },
    async getPage(userId, page) {
        let start = (page-1)*25+1;
        return await Pokedex.query().select('*')
            .where('userId', userId)
            .where('pokedexId', '>=', start)
            .where('pokedexId', '<=', start+25);
    }
}