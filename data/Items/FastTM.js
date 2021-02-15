const CustomError = require('~/lib/errors/CustomError');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const MoveList = require('~/data/Lists/MoveList');

class FastTM {
    constructor() {
        this.id = 17;
        this.name = 'Fast TM';
        this.searchName = 'fasttm';
        this.plural = 'Fast TMs';
        this.emoji = '<:fast:806199424141099059>';
        this.description = "Changes a Pokemon's fast move.";
        this.shopItem = true;
        this.price = 500;
        this.sellPrice = 250;
        this.fromPokestop = false;
        this.fromGym = false;
        this.requiredLevel = 0;
        this.requiresEncounter = false;
        this.type = 'tm';
    }
    async use(msg, pokemonId) {
        if(!pokemonId) {
            throw new CustomError('MISSING_PARAMETER', 'pokemonId');
        }
        const pokemon = await PokemonCommands.getStrictPokemon(msg.userId, pokemonId);
        let moves = pokemon.getLearnableFastMoves(false).filter(el => el[0] != pokemon.fastMove)
        const newMove = MoveList[moves[Math.floor(Math.random() * moves.length)][0]];

        await PokemonCommands.update(pokemonId, [
            { rowName: 'fastMove', value: newMove.id }
        ]);

        const embed = {
            title: 'Move Changed!',
            description: `${pokemon.displayName} learned ${newMove.name}!`,
            image: pokemon.url
        }

        return embed;
    }
}

module.exports = new FastTM();