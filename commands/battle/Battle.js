const RocketPokemon = require('~/knex/models/RocketPokemon');
const Battles = require('~/knex/models/Battles');
const TypeEffectivenessList = require('~/data/Lists/TypeEffectivenessList');
const MoveList = require('~/data/Lists/MoveList');
const Pokemon = require('~/knex/models/Pokemon');
const TeamListings = require('~/knex/models/TeamListings');
const CustomError = require('~/lib/errors/CustomError');
const { raw } = require('objection');
const PromptShieldMenu = require('../../menus/PromptShieldMenu');

class Battle {
    constructor(msg) {
        this.msg = msg;
    }
    getTeam() {
        return this.playerTeam;
    }
    getAdjustedTimeout() {
        return this.turnTimeout - this.timeElapsed;
    }
    async create() {
        this.rocketTeam = await RocketPokemon.query().select('*')
            .where('userId', this.msg.userId)
            .whereNot('hp', 0);

        const b = await Battles.query().select('*')
            .withGraphFetched('playerTeam.[pokemon]')
            .where('userId', this.msg.userId)
            .first();

        Object.assign(this, b);

        this.playerPokemon = this.playerTeam.pokemon.find(el => el.active);
        this.rocketPokemon = this.rocketTeam.find(el => el.hp > 0);

        this.playerDelay = this.playerPokemon.delay;
        this.rocketDelay = this.rocketPokemon.delay;

        this.rocketMove = MoveList[this.rocketPokemon.fastMove];
        this.playerMove = MoveList[this.playerPokemon.fastMove];
        this.rocketChargeMove = MoveList[this.rocketPokemon.chargeMove];
        this.playerChargeMove = MoveList[this.playerPokemon.chargeMove];

        this.timeElapsed = 0;
    }
    checkHP() {
        let status = {
            player: false,
            rocket: false
        }
        if(this.playerPokemon.hp <= 0) {
            this.playerPokemon.hp = 0;
            status.player = true;
        }
        if(this.rocketPokemon.hp <= 0) {
            this.rocketPokemon.hp = 0;
            status.rocket = true;
        }
        return status;
    }
    calculateDamage(attacker, defender, move) {
        const attack = attacker.attack;
        const defense = defender.defense;
        const attackerTypes = attacker.types;
        const defenderTypes = defender.types;
        let multiplier = 1;
        let description = attacker.name + ' used ' + move.name + '!';
        if(attackerTypes.includes(move.type)) {
            multiplier *= 1.2; //STAB bonus
            description += ' (STAB)';
        }
        for(var i=0;i<defenderTypes.length;i++) {
            if(defenderTypes[i]) {
                multiplier *= TypeEffectivenessList[move.type][defenderTypes[i]]; //type bonuses
                description += ' ' + TypeEffectivenessList[move.type][defenderTypes[i]];
            }
        }
        const damage = Math.floor(0.5 * move.pvpPower * (attack/defense) * multiplier) + 1;
        console.log(description);
        return damage;
    }
    handleRocketDamage(askedToUseShield=false, usedShield=false) {
        //setting rocket to 0
        if(this.rocketDelay < this.playerDelay) {
            this.playerDelay -= this.rocketDelay;
            this.timeElapsed += this.rocketDelay;
            this.rocketDelay = 0;
        }
        let rocketDamage;
        while(this.rocketDelay < this.playerDelay && this.playerPokemon.hp > 0 && this.rocketPokemon.hp > 0) {
            //player was asked if they wanted to use a shield
            if(askedToUseShield) {
                askedToUseShield = false;
                if(usedShield) {
                    this.playerShields--;
                    //no damage should be done
                    rocketDamage = 0;
                }
                else {
                    rocketDamage = this.calculateDamage(this.rocketPokemon, this.playerPokemon, this.rocketChargeMove);
                }
            }
            if(this.rocketPokemon.energy >= this.rocketPokemon.requiredChargeEnergy) { //rocket can use charge attack
                this.rocketPokemon.energy -= this.rocketPokemon.requiredChargeEnergy; //remove their energy
                console.log(this.playerShields);
                if(this.playerShields) { //if the user still has shields
                    this.menu = {
                        class: PromptShieldMenu,
                        parameters: {
                            pokemon1: this.playerPokemon,
                            pokemon2: this.rocketPokemon,
                        }
                    }
                    return { exit: true } //exit early to handle shield action
                }
                else {
                    rocketDamage = this.calculateDamage(this.rocketPokemon, this.playerPokemon, this.rocketChargeMove);
                }
            }
            //don't reset if they used charge move
            else if(!rocketDamage) {
                rocketDamage = this.calculateDamage(this.rocketPokemon, this.playerPokemon, this.rocketMove);
            }
            this.playerPokemon.hp -= rocketDamage;
            
            if(!askedToUseShield) {
                //charge moves don't give energy
                this.rocketPokemon.energy += this.rocketMove.pvpEnergy;
                this.timeElapsed += this.rocketMove.duration;
                this.playerDelay -= this.rocketMove.duration;
            }
    
            let status = this.checkHP();
            if(status.player) {
                return status;
            }
        }
        if(this.playerDelay < 0) {
            this.rocketDelay += Math.abs(this.playerDelay);
            this.playerDelay = 0;
        }
        else if(rocketDamage) {
            this.rocketDelay = this.rocketMove.duration;
        }
        return {};
    }
    async updateFields() {
        //update player HP
        await Pokemon.query().update({
            hp: this.playerPokemon.hp
        })
        .where('pokemonId', this.playerPokemon.pokemonId);

        if(this.rocketPokemon.energy > 100) {
            this.rocketPokemon.energy = 100;
        }
        
        //update rocket HP and energy
        await RocketPokemon.query().update({
            hp: this.rocketPokemon.hp,
            energy: this.rocketPokemon.energy,
            delay: this.rocketDelay,
        })
        .where('pokemonId', this.rocketPokemon.pokemonId);
        
        let battleUpdate = {
            firstTurn: false,
            playerShields: this.playerShields,
        }
        if(this.turnTimeout != 0) {
            if(this.turnTimeout - this.timeElapsed < 0) {
                battleUpdate.turnTimeout = 0;
            }
            else {
                battleUpdate.turnTimeout = raw(`turnTimeout - ${this.timeElapsed}`);
            }
        }
        //not first turn of battle anymore
        await Battles.query().update(battleUpdate)
            .where('userId', this.msg.userId);

        //can only have 100 energy maximum
        if(this.playerPokemon.energy > 100) {
            this.playerPokemon.energy = 100;
        }      
        //update our energy
        await TeamListings.query().update({
            energy: this.playerPokemon.energy,
            delay: this.playerDelay
        })
        .where('active', true);
    }
    async handleTurn(action) {
        let status;
        if(action == 's') {
            return { switch: true }
        }

        if(this.rocketDelay < this.playerDelay) { //rocket switched so they should go first
            status = this.handleRocketDamage();
            if(status.player) { //player fainted
                await this.updateFields();
                return status;
            }
            if(status.exit) {
                await this.updateFields();
                return {}
            }
        }

        //Our turn. Set our delay to 0 and decrement rocket delay by same value
        this.rocketDelay -= this.playerDelay;
        this.timeElapsed += this.playerDelay;
        this.playerDelay = 0;

        //this is up here because the first turn block is prioritized so the user can attempt a charge first turn
        if(action == 'c') {
            console.log(this.playerPokemon.energy, this.playerPokemon.requiredChargeEnergy);
            if(this.playerPokemon.energy >= this.playerPokemon.requiredChargeEnergy) {
                const playerDamage = this.calculateDamage(this.playerPokemon, this.rocketPokemon, this.playerChargeMove);
                this.rocketPokemon.hp -= playerDamage;
                //remove energy
                this.playerPokemon.energy -= this.playerChargeMove.energy;

                //no delay for charge move
            }
            else {
                throw new CustomError('NOT_ENOUGH_ENERGY');
            }
        }
        //if it's the first turn or both delays are equal meaning they should both go
        else if(this.firstTurn || this.playerDelay == this.rocketDelay) {
            //do both attacks
            const playerDamage = this.calculateDamage(this.playerPokemon, this.rocketPokemon, this.playerMove);
            const rocketDamage = this.calculateDamage(this.rocketPokemon, this.playerPokemon, this.rocketMove);

            //rocket wont use charge attack here

            //set the delays
            this.playerDelay = this.playerMove.duration;
            this.rocketDelay = this.rocketMove.duration;

            //remove HP
            this.playerPokemon.hp -= rocketDamage;
            this.rocketPokemon.hp -= playerDamage;

            //rocket energy is usually added in handleRocketDamage so we need to increment it here
            this.playerPokemon.energy += this.playerMove.pvpEnergy;
            this.rocketPokemon.energy += this.rocketMove.pvpEnergy;

            //have either of them fainted?
            status = this.checkHP();
            if(status.player || status.rocket) {
                await this.updateFields();
                return status;
            }
        }
        else if(action == 'f') { //fast
            const playerDamage = this.calculateDamage(this.playerPokemon, this.rocketPokemon, this.playerMove);
            this.rocketPokemon.hp -= playerDamage;
            this.playerPokemon.energy += this.playerMove.pvpEnergy;

            //since we did an attack
            //this is set to 0 anyway?
            this.rocketDelay -= this.playerDelay;
            this.playerDelay = this.playerMove.duration;
        }

        //user attack finished

        //is the rocket dead?
        status = this.checkHP();
        if(status.rocket) {
            await this.updateFields();
            return status;
        }

        //do the rockets attack
        status = this.handleRocketDamage();
        if(status.player) {
            await this.updateFields();
            return status;
        }

        console.log(this.playerDelay, this.rocketDelay)
        await this.updateFields();

        return {};
    }
}

module.exports = Battle;