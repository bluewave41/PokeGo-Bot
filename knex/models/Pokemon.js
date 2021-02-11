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
    get requiredChargeEnergy() {
        return MoveList[this.chargeMove].pvpEnergy;
    }
	get path() {
        if(this.shadow) {
            if(this.shiny) {
                return `public/sprites/shadow/shiny/${this.originalName.toLowerCase()}.png`;
            }
            else {
                return `public/sprites/shadow/normal/${this.originalName.toLowerCase()}.png`;
            }
        }
        else if(this.shiny) {
            return `public/sprites/shiny/${this.originalName.toLowerCase()}.png`;
        }
        else {
            return `public/sprites/normal/${this.originalName.toLowerCase()}.png`;
        }
	}
    get url() {
        if(this.shadow) {
            if(this.shiny) {
                return process.env.trueUrl + `sprites/shadow/shiny/${this.originalName.toLowerCase()}.png`;
            }
            else {
                return process.env.trueUrl + `sprites/shadow/normal/${this.originalName.toLowerCase()}.png`;
            }
        }
        else if(this.shiny) {
            return process.env.trueUrl + `sprites/shiny/${this.originalName.toLowerCase()}.png`;
        }
        else {
            return process.env.trueUrl + `sprites/normal/${this.originalName.toLowerCase()}.png`;
        }
    }
    getLearnableFastMoves(includeLegacy=false) {
        let moves = PokemonData[this.pokedexId].fastMoves;
        if(!includeLegacy) {
            moves = moves.filter(el => !el[1]); //el[1] is isLegacy field
        }
        return moves;
    }
    getLearnableChargeMoves(includeLegacy=false) {
        let moves = PokemonData[this.pokedexId].chargeMoves;
        if(!includeLegacy) {
            moves = moves.filter(el => !el[1]); //el[1] is isLegacy field
        }
        return moves;
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
        if(this.shadow) {
            name += '<:shadow:738006884430119002>';
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
        return null;
    }
    get attack() {
        const base = PokemonData[this.pokedexId];
        const multiplier = PowerupTable.find(el => el.level == this.level).multiplier;
        if(this.shadow) {
            return ((base.attack + this.atkiv) * multiplier) * 1.2;
        }
        return (base.attack + this.atkiv) * multiplier;
    }
    get defense() {
        const base = PokemonData[this.pokedexId];
        const multiplier = PowerupTable.find(el => el.level == this.level).multiplier;
        if(this.shadow) {
            return ((base.defense + this.defiv) * multiplier) * 0.83;
        }
        return (base.defense + this.defiv) * multiplier;
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
            totaliv: this.totalIV,
            shadow: this.shadow,
            fastMove: this.fastMove,
            chargeMove: this.chargeMove
        }
    }
    get rocketInsert() {
        return {
            pokedexId: this.pokedexId,
            cp: this.cp,
            hp: this.hp, 
            hpiv: this.hpiv,
            atkiv: this.atkiv,
            defiv: this.defiv,
            gender: this.gender,
            level: this.level,
            maxHP: this.hp,
            fastMove: this.fastMove,
            chargeMove: this.chargeMove,
            userId: this.userId,
            fastMove: this.fastMove,
            chargeMove: this.chargeMove,
        }
    }
    get catchCandy() {
        const stage = PokemonData[this.pokedexId].stage;
        switch(stage) {
            case 1:
                return 3;
            case 2:
                return 5;
            case 3:
                return 10;
        }
        return null;
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