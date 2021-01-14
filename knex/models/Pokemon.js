const { Model } = require('objection');
const MoveList = require('~/data/Lists/MoveList');
const PokemonData = require('~/data/PokemonData');
const PowerupTable = require('~/data/Lists/PowerupList');

class Pokemon extends Model {
	static get tableName() {
		return 'pokemon';
    }
    static get virtualAttributes() {
        return ['url', 'path', 'emoji', 'name', 'originalName', 'totalIV', 'evolveCost', 'evolution', 'moves'];
    }
    static get idColumn() {
        return 'pokemonId';
    }
	get path() {
		if(this.shiny) {
            return `/sprites/shiny/${this.originalName.toLowerCase()}.png`;
        }
        else {
            return `/sprites/normal/${this.originalName.toLowerCase()}.png`;
        }
	}
    get url() {
        if(this.shiny) {
            return process.env.sprites + `/shiny/${this.pokedexId}.png`;
        }
        else {
            return process.env.sprites + `/normal/${this.pokedexId}.png`;
        }
    }
    get types() {
        return [PokemonData[this.pokedexId].type1, PokemonData[this.pokedexId].type2];
    }
    get emoji() {
        return PokemonData[this.pokedexId].emoji;
    }
    get displayName() {
        let name = this.nickname ? this.nickname : PokemonData[this.pokedexId].name;
        if(this.favorite) {
            name += ':star:';
        }
        if(this.shiny) {
            name += ':sparkles:';
        }
        return name;
    }
    get name() {
        if(this.nickname) {
            return this.nickname;
        }
        return PokemonData[this.pokedexId].name;
    }
    get originalName() {
        return PokemonData[this.pokedexId].name;
    }
    get captureRate() {
        return PokemonData[this.pokedexId].captureRate;
    }
    get candyId() {
        return PokemonData[this.pokedexId].candyId;
    }
    get evolveCost() {
        return PokemonData[this.pokedexId].evolveCost;
    }
    get evolveId() {
        return PokemonData[this.pokedexId].evolveId;
    }
    get evolution() {
        const evolutions = PokemonData[this.pokedexId].evolveId;
        if(Array.isArray(evolutions)) { //pokemon has multiple evolutions
            return evolutions.map(function(el) {
                const name = PokemonData[el].name;
                return name.charAt(0).toUpperCase() + name.slice(1);
            });
        }
        else if(evolutions) {
            const name = PokemonData[evolutions].name;
            return [name.charAt(0).toUpperCase() + name.slice(1)];
        }
        return null;
    }
    get moves() {
        const fast = MoveList[this.fastMove];
        const charge = MoveList[this.chargeMove];
        return [{name: fast.name, type: fast.type}, {name: charge.name, type: charge.type, energyBars: charge.energyBars}];
    }
    get catchDust() {
        switch(PokemonData[this.pokedexId].stage) {
            case 1:
                return 100;
            case 2:
                return 300;
            case 3:
                return 500;
        }
    }
    get insert() {
        return {
            ownerId: this.ownerId,
            pokedexId: this.pokedexId,
            nickname: this.nickname,
            cp: this.cp,
            hp: this.hp, 
            hpiv: this.hpiv,
            atkiv: this.atkiv,
            defiv: this.defiv,
            shiny: this.shiny,
            gender: this.gender,
            level: this.level,
            maxHP: this.hp,
            fastMove: this.fastMove,
            chargeMove: this.chargeMove,
            totaliv: this.totalIV,
        }
    }
    get catchCandy() {
        const stage = PokemonData[this.pokedexId].stage;
        switch(stage) {
            case 1:
                return 3;
            case 2:
                return 5;
            case 2:
                return 10;
        }
    }
    get totalIV() {
        let total = 48;
        let sum = this.hpiv + this.atkiv + this.defiv;
        return ((sum / total) * 100).toFixed(2);
    }
    calculateNewCP(level) {
        const base = PokemonData[this.pokedexId];
        const attack = base.attack + this.atkiv;
        const defense = Math.pow(base.defense + this.defiv, 0.5);
        const hp = Math.pow(base.hp + this.hpiv, 0.5);

        const powerupRow = PowerupTable.find(el => el.level == level);
            
        let cp = Math.floor((attack * defense * hp) * Math.pow(powerupRow.multiplier, 2) / 10);
        if(cp < 10) {
            cp = 10;
        }
        return cp;
    }
    calculateHP(level) {
        const base = PokemonData[this.pokedexId];
        const powerupRow = PowerupTable.find(el => el.level == level);
		return Math.floor((base.hp + this.hpiv) * powerupRow.multiplier);
	}
}

module.exports = Pokemon;