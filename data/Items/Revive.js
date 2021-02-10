const HealPokemonMenu = require('~/menus/HealPokemonMenu');
const Pokemon = require('~/knex/models/Pokemon');
const CustomError = require('~/lib/errors/CustomError');
const UserCommands = require('~/data/ModelHandlers/UserCommands');

class Revive {
    constructor() {
        this.id = 10;
        this.name = 'Revive';
        this.searchName = 'revive';
        this.plural = 'Revives';
        this.emoji = '<:revive:795413532791144518>';
        this.description = 'Revives a Pokemon from being fainted with half HP.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = true;
        this.requiredLevel = 5;
        this.requiresEncounter = false;
        this.type = 'revive';
    }
    async use(userId) {
        const pokemon = await Pokemon.query().select('*')
            .where('ownerId', userId);
        if(!pokemon.length) {
            throw new CustomError('NO_FAINTED_POKEMON');
        }
        await UserCommands.update(userId, [
            { rowName: 'nextCommand', value: 'items/RevivePokemon' },
            { rowName: 'saved', value: JSON.stringify({ multiplier: 0.5 })}
        ]);
        this.menu = {
            class: HealPokemonMenu,
            parameters: {
                title: 'Revive Pokemon',
                pokemon: pokemon,
            }
        }
    }
}

module.exports = new Revive();