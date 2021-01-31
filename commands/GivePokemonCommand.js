const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const PokemonBuilder = require('~/lib/PokemonBuilder');
const Command = require('./Command');

const options = {
    names: ['givePokemon'],
    ownerOnly: true,
    expectedParameters: [
        { name: 'pokemonId', type: ['number'], optional: false },
        { name: 'level', type: 'number', optional: false },
        { name: 'amount', type: ['number'], optional: false},
    ]
}

class GivePokemonCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {  
        super.validate();
    }
    async run() {
        let pokemon = PokemonBuilder.generatePokemon(this.pokemonId, this.level, this.msg.userId);
    
        for(var i=0;i<this.amount;i++) {
            await PokemonCommands.catchPokemon(this.msg.userId, pokemon, 3);
        }
    
        const embed = {
            title: 'Pokemon Given',
            description: `Added ${this.amount} ${pokemon.name}.`,
            image: pokemon.url
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: GivePokemonCommand,
}