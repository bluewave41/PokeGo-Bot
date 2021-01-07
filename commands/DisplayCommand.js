const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');
const Emojis = require('../Emojis');

module.exports = async function(msg) {
    let response = await axios.post(process.env.url + 'user/pokemon/get', {userId: msg.userId, pokemonId: msg.parameters[0]});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let pokemon = response.data

    let statString = '';
    statString += `**CP: **${pokemon.cp}\n`;
    statString += `**HP: **${pokemon.hp}/${pokemon.maxHP}\n`;
    statString += `**HP IV: **${pokemon.hpiv}/15\n`;
    statString += `**ATK IV: **${pokemon.atkiv}/15\n`;
    statString += `**DEF IV:  **${pokemon.defiv}/15\n`;

    let evolveString = `**Candy: ** ${pokemon.candy}\n`;
    if(pokemon.evolution) {
        evolveString += `Evolves into for ${pokemon.evolveCost} candies: \n`;
        for(var i=0;i<pokemon.evolution.length;i++) {
            evolveString += '- ' + pokemon.evolution[i] + '\n';
        }
    }
    else {
        evolveString += `No evolutions found.`;
    }

    let moves = `${Emojis[pokemon.moves[0].type.toUpperCase()]} ${pokemon.moves[0].name} \n ${Emojis[pokemon.moves[1].type.toUpperCase()]} ${pokemon.moves[1].name}`;
    for(var i=0;i<pokemon.moves[1].energyBars;i++) {
        moves += ' <:energybar:792030910852628530>';
    }

    const fields = [
        ['Stats', statString, false],
        ['Moves', moves, false],
        ['Evolution', evolveString, false],
    ]

    let embed = {
        title: `Level ${pokemon.level} ${pokemon.name}`,
        description:  ``,
        fields: fields,
        image: pokemon.url,
    }

    return EmbedBuilder.build(msg, embed);
}