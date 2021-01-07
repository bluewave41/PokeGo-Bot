const axios = require('axios');
const PokemonListBuilder = require('../PokemonListBuilder');
const EmbedBuilder = require('../EmbedBuilder');

module.exports = async function(msg) {
    //>list 1 flags - offset is 1
    //>list flags - offset is 0
    const offset = Number.isInteger(parseInt(msg.parameters[0])) ? msg.parameters[0] : 1;
    const data = {
        userId: msg.userId,
        offset: offset,
        parameters: offset == 1 ? msg.parameters[0] : msg.parameters[1],
    }
    let response = await axios.post(process.env.url + 'user/pokemon/list', data);
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let embed = {
        title: 'List',
        description: PokemonListBuilder.build(response.data.list),
        footer: `Page ${offset} of ${Math.ceil(response.data.totalpokemon/25)} - ${response.data.totalpokemon} results.`
    }
    return EmbedBuilder.build(msg, embed);
}