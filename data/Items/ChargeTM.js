const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const CustomError = require('~/lib/errors/CustomError');
const MoveList = require('~/data/Lists/MoveList');

class ChargeTM {
    constructor() {
        this.id = 18;
        this.name = 'Charge TM';
        this.searchName = 'chargetm';
        this.plural = 'Charge TMs';
        this.emoji = '<:charge:806199424032309352>';
        this.description = "Changes a Pokemon's charge move.";
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
        let moves = pokemon.getLearnableChargeMoves(false).filter(el => el[0] != pokemon.chargeMove);
        const newMove = MoveList[moves[Math.floor(Math.random() * moves.length)][0]];

        await PokemonCommands.update(pokemonId, [
            { rowName: 'chargeMove', value: newMove.id }
        ]);

        const embed = {
            title: 'Move Changed!',
            description: `${pokemon.displayName} learned ${newMove.name}!`,
            image: pokemon.url
        }

        return embed;
    }
}

module.exports = new ChargeTM();