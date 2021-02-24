const CandyCommands = require('./CandyCommands');
const PokemonModel = require('~/knex/models/Pokemon');
const PokemonBuilder = require('~/lib/PokemonBuilder');
const CustomError = require('~/lib/errors/CustomError');
const Pokemon = require('~/knex/models/Pokemon');
const PokedexCommands = require('./PokedexCommands');
const MedalCommands = require('./MedalCommands');
const Utils = require('~/lib/Utils');

module.exports = {
    /**
     * Returns a Pokemon only if the Pokemon belongs to the user running it
     * @param {*} userId 
     * @param {*} id 
     */
    async getStrictPokemon(userId, pokemonId) {
        const pokemon = await PokemonModel.query().select('*')
            .where('ownerId', userId)
            .where('pokemonId', pokemonId)
            .limit(1)
            .first();
        if(!pokemon) {
            throw new CustomError('NO_POKEMON', pokemonId);
        }
        return pokemon;
    },
    async getPokemonCount(userId) {
        const pokemon = await PokemonModel.query().count('* as count')
            .where('ownerId', userId)
            .first();
            
        return parseInt(pokemon.count);
    },
    async canTransferPokemon(userId, pokemonId) {
        const count = await this.getPokemonCount(userId);
        if(count <= 1) {
            throw new CustomError("CANT_TRANSFER_LAST_POKEMON");
        }
        const pokemon = await this.getStrictPokemon(userId, pokemonId);
        if(pokemon.favorite) {
            throw new CustomError("CANT_TRANSFER_FAVORITE");
        }
        return true;
    },
    async catchPokemon(userId, pokemon, candyAmount) {
        pokemon.ownerId = userId;
        //add pokemon
        pokemon = await PokemonModel.query().insert(pokemon.insert);

        //add candy
        await CandyCommands.insertCandy(userId, pokemon.candyId, candyAmount);

        //add stardust
        //await UserCommands.increment(userId, 'stardust', pokemon.catchDust);

        //add pokedex entry
        await PokedexCommands.insert(userId, pokemon.pokedexId, true);

        //add medals
        await MedalCommands.insertBadge(userId, pokemon.types);

        return pokemon;
    },
    async getPokemon(userId, pokemonId) {
        let pokemon = await PokemonModel.query().select('*')
        .where('ownerId', userId)
        .where('pokemonId', pokemonId);
        return pokemon[0];
    },
    async transferPokemon(userId, pokemonId) {
        let pokemon = await this.getPokemon(userId, pokemonId);
        let result = await this.deletePokemon(userId, pokemonId);

        if(result) {
            await CandyCommands.insertCandy(userId, pokemon.candyId, 1);
        }

        return pokemon;
    },
    async deletePokemon(userId, pokemonId) {
        let result = await PokemonModel.query().delete()
        .where('ownerId', userId)
        .where('pokemonId', pokemonId);
        return result;
    },
    async powerupPokemon(userId, pokemon, amount) {
        pokemon.level += amount;
        PokemonBuilder.calculateStats(pokemon);
        await PokemonModel.query().update(pokemon.insert)
            .where('ownerId', userId)
            .where('pokemonId', pokemon.pokemonId);
    },
    async evolvePokemon(userId, pokemon) {
        /*Remove candy first since we change the Pokemon below*/
        await CandyCommands.removeCandy(userId, pokemon.candyId, pokemon.evolveCost);

        if(Array.isArray(pokemon.evolveId)) {
            pokemon.pokedexId = pokemon.evolveId[Math.floor(Math.random() * pokemon.evolveId.length)];
        }
        else {
            pokemon.pokedexId = pokemon.evolveId;
        }
        
        PokemonBuilder.calculateCP(pokemon);
        PokemonBuilder.calculateHP(pokemon);

        //change their moves
        pokemon.fastMove = Utils.random(pokemon.getLearnableFastMoves(false));
        pokemon.chargeMove = Utils.random(pokemon.getLearnableChargeMoves(false));

        //Pokemon HP is refilled if they're evolved
        pokemon = await Pokemon.query().updateAndFetchById(pokemon.pokemonId, {
            pokedexId: pokemon.pokedexId,
            hp: pokemon.hp,
            maxHP: pokemon.hp,
            cp: pokemon.cp,
            fastMove: pokemon.fastMove[0],
            chargeMove: pokemon.chargeMove[0]
        })
        .where('ownerId', userId)
        .where('pokemonId', pokemon.pokemonId);

        return pokemon;
    },
    async getTop3(userId) {
        const pokemon = await Pokemon.query().select('*')
            .orderBy('cp')
            .limit(3)
            .where('ownerId', userId);
        return pokemon;
    },
	async getAllPokemon(userId) {
		return await Pokemon.query().select('*')
			.where('ownerId', userId);
    },
        /**
     * Updates a column in the Pokemon table of the databae.
     * @param {Integer} userId msg.userId
     * @param {Array > objects} options Array of objects containing column to change, value to change it to and flags.
     */
    async update(pokemonId, options) {
        const values = [].concat(options || []);
        let query = Pokemon.query();
        let updateObject = {};
        for(var i=0;i<values.length;i++) {
            let row = values[i];
            updateObject[row.rowName] = row.value;
        }
        await Pokemon.query().update(updateObject)
            .where('pokemonId', pokemonId);
        await query;
    },
    async getFirstPokemon(userId) {
        const pokemon = await Pokemon.query().select('*')
            .where('ownerId', userId)
            .limit(1)
            .first();
        return pokemon;
    }
}