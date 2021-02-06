const PokemonListBuilder = require('~/data/Builders/PokemonListBuilder');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const Pokemon = require('../knex/models/Pokemon');
const Utils = require('~/lib/Utils');

const options = {
    names: ['list'],
    expectedParameters: [
        { name: 'offset', type: ['number'], optional: true, default: 1, ifDefined: [
            { name: 'options', type: ['string'], optional: true, default: '' }
        ] },
        { name: 'options', type: ['string'], optional: true, default: '' },
    ]
}

class ListCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        let page = this.offset;
        this.offset = this.offset * 25 - 25;
        const result = await buildQueryFromOptions(this.msg.userId, this.offset, this.options);

        let embed = {
            title: 'List',
            description: PokemonListBuilder.build(result.pokemon),
        }
    
        if(result.pokemon.length) {
            embed.footer = `Page ${page} of ${Math.ceil(result.count/25)} - ${result.count} results.`;
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: ListCommand
}

async function buildQueryFromOptions(userId, offset, options) {
    let query = Pokemon.query().select('*')
        .offset(offset)
        .limit(25)
        .where('ownerId', userId);

    let count = Pokemon.query().count('* as pokemonCount')
        .where('ownerId', userId)
        .first();

    if(options) {
        const parameters = options.split(',');
        for(var i=0;i<parameters.length;i++) {
            if(parameters[i] == 'favorite') {
                query.where('favorite', true);
                count.where('favorite', true);
            }
            else if(parameters[i] == 'shiny') {
                query.where('shiny', true);
                count.where('shiny', true);
            }
            else if(parameters[i] == 'shadow') {
                query.where('shadow', true);
                count.where('shadow', true);
            }
            else if(parameters[i].startsWith('sort')) {
                const split = parameters[i].split('=');
                const sortColumn = split[1];
                switch(sortColumn) {
                    case 'cp':
                        query.orderBy('cp', 'DESC');
                        break;
                    case 'iv':
                        query.orderBy('totaliv', 'DESC');
                        break;
                    case 'level':
                        query.orderBy('level', 'DESC');
                        break;
                    case 'id':
                        query.orderBy('pokemonId', 'DESC');
                        break;
                    case 'pokedex':
                        query.orderBy('pokedexId', 'DESC');
                        break;
                }
            }
            else {
                let char = parameters[i].includes('<') ? '<' : parameters[i].includes('>') ? '>' : parameters[i].includes('=') ? '=' : '';
                if(char) {
                    let split = parameters[i].split(char);
                    query.where('totalIV', char, split[1]);
                    count.where('totalIV', char, split[1]);
                }
                const id = Utils.getIdFromName(parameters[i]);
                if(id) {
                    query.where('pokedexId', id);
                    count.where('pokedexId', id);
                }
            }
        }
    }
    let pokemon = await query;
    count = await count;

    return { pokemon: pokemon, count: parseInt(count.pokemonCount) }
}