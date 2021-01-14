const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PokemonData = require('../data/PokemonData');
const CustomError = require('../lib/errors/CustomError');
const Command = require('./Command');
const PokedexCommands = require('~/data/ModelHandlers/PokedexCommands');

const options = {
    names: ['pokedex'],
    expectedParameters: [
        { name: 'page', type: 'number', optional: true, default: 1 }
    ]
}

//TODO if last was pokedex just change last message?

class PokedexCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const pokemon = await getPokemon(this.msg.userId, this.page);

        let embed = {
            title: 'Pokedex',
            description: 'Pokedex',
        }
    
        let fields = [];
    
        for(var i=0;i<pokemon.length;i++) {
            let entry = pokemon[i];
            fields.push([entry.name, `${entry.emoji}\nSeen: ${entry.seen}\nCaught: ${entry.caught}`, true])
        }
    
        embed.fields = fields;
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

async function getPokemon(userId, page) {
    const pokedex = await PokedexCommands.getPage(userId, page);

    let start = (page-1)*25+1;

    const numberOfPokemon = Object.keys(PokemonData).length;
    const maxPage = Math.ceil(numberOfPokemon/25);

    if(page > maxPage) {
        throw new CustomError('PAGE_TOO_HIGH', maxPage);
    }

    let pokemon = [];
    for(var i=start;i<=start+25;i++) {
        if(i > numberOfPokemon) {
            break;
        }
        let pokemonData = PokemonData[i];
        let data = {name: pokemonData.name, emoji: pokemonData.emoji};
        let element = pokedex.find(el => el.pokedexId == i);
        if(element) {
            data.seen = element.seen;
            data.caught = element.caught;
        }
        else {
            data.seen = 0;
            data.caught = 0;
        }
        pokemon.push(data);
    }
    return pokemon;
}

module.exports = {
    options: options,
    class: PokedexCommand
}