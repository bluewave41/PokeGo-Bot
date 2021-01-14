const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const CandyCommands = require('~/data/ModelHandlers/CandyCommands');
const Command = require('./Command');
const CustomError = require('~/lib/errors/CustomError');

const options = {
    names: ['evolve'],
    expectedParameters: [
        { name: 'pokemonId', type: ['number'], optional: false}
    ]
}

class EvolveCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        if(!this.pokemon.evolveCost) {
            throw new CustomError('NO_EVOLUTIONS');
        }
        this.candy = await CandyCommands.getCandyForPokemon(this.msg.userId, this.pokemon.candyId);
        if(this.candy < this.pokemon.evolveCost) {
            throw new CustomError('INSUFFICIENT_EVOLVE_CANDY', this.pokemon.evolveCost);
        }
    }
    async run() {
        const oldName = this.pokemon.name;
        const evolveCost = this.pokemon.evolveCost; //have to use old Pokemon evolve cost

        this.pokemon = await PokemonCommands.evolvePokemon(this.msg.userId, this.pokemon);
        
        const embed = {
            title: 'Evolution',
            description: `Congratulations! Your ${oldName} evolved into ${this.pokemon.originalName}!`,
            image: this.pokemon.url,
            footer: `Remaining candy: ${this.candy - evolveCost}`,
        }

        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: EvolveCommand
}