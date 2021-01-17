const { Model } = require('objection');
const PowerupTable = require('~/data/Lists/PowerupList');
const Pokemon = require('./Pokemon');

class PlayerEncounters extends Model {
	static get tableName() {
		return 'player_encounters';
    }
    static get idColumn() {
        return 'userId';
    }
    get pokemon() {
        const pokemon = Pokemon.fromJson({
            cell: this.cell,
            pokedexId: this.pokedexId,
            cp: this.cp,
            level: this.level,
            hp: this.hp,
            hpiv: this.hpiv,
            atkiv: this.atkiv,
            defiv: this.defiv,
            fastMove: this.fastMove,
            chargeMove: this.chargeMove,
            gender: this.gender,
            shiny: this.shiny,
        });
        return pokemon;
    }
    get multiplier() {
        const ItemHandler = require('~/lib/ItemHandler');
        let multiplier = this.medalMultiplier;

        multiplier *= ItemHandler.getItem(this.activePokeball).catchMultiplier;
        if(this.item) {
            multiplier *= ItemHandler.getItem(this.item).catchMultiplier;
        }
        return multiplier;
    }
    get catchChance() {
        let chance;
        const catchRate = this.pokemon.captureRate/100;
        chance = catchRate / (PowerupTable[this.level].multiplier * 2);
        if(chance > 1) {
            return 1;
        }
        chance = 1 - chance;
        chance = Math.pow(chance, this.multiplier);
        chance = 1 - chance;
        return chance;
    }
}

module.exports = PlayerEncounters;