const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Emojis = require('~/data/Lists/EmojiList');
const Command = require('./Command');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const CandyCommands = require('~/data/ModelHandlers/CandyCommands');

const options = {
    names: ['display', 'd'],
    expectedParameters: [
        { name: 'pokemonId', type: ['number'], optional: false }
    ]
}

class DisplayCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        let candy = await CandyCommands.getCandyForPokemon(this.msg.userId, this.pokemon.candyId);
        this.pokemon.candy = candy;
    }
    async run() {
        let statString = '';
        statString += `**CP: **${this.pokemon.cp}\n`;
        statString += `**HP: **${this.pokemon.hp}/${this.pokemon.maxHP}\n`;
        statString += `**HP IV: **${this.pokemon.hpiv}/15\n`;
        statString += `**ATK IV: **${this.pokemon.atkiv}/15\n`;
        statString += `**DEF IV:  **${this.pokemon.defiv}/15\n`;
    
        let evolveString = `**Candy: ** ${this.pokemon.candy}\n`;
        if(this.pokemon.evolution) {
            evolveString += `Evolves into for ${this.pokemon.evolveCost} candies: \n`;
            for(var i=0;i<this.pokemon.evolution.length;i++) {
                evolveString += '- ' + this.pokemon.evolution[i] + '\n';
            }
        }
        else {
            evolveString += `No evolutions found.`;
        }
    
        let moves = `${Emojis[this.pokemon.moves[0].type.toUpperCase()]} ${this.pokemon.moves[0].name} \n ${Emojis[this.pokemon.moves[1].type.toUpperCase()]} ${this.pokemon.moves[1].name}`;
        for(var i=0;i<this.pokemon.moves[1].energyBars;i++) {
            moves += ' <:energybar:792030910852628530>';
        }
    
        const fields = [
            ['Stats', statString, false],
            ['Moves', moves, false],
            ['Evolution', evolveString, false],
        ]

        console.log(this.pokemon.url)
    
        let embed = {
            title: `Level ${this.pokemon.level} ${this.pokemon.displayName}`,
            description:  ``,
            fields: fields,
            image: this.pokemon.url,
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: DisplayCommand
}