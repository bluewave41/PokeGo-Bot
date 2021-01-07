const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');

module.exports = async function(msg) {
    let pokemonId = msg.parameters.shift();
    let nickname = msg.parameters.join(' ');
    let response = await axios.post(process.env.url + 'user/pokemon/nickname', {userId: msg.userId, pokemonId: pokemonId, nickname: nickname});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }
    let pokemon = response.data;
    let embed = {
        title: 'Nickname',
        description: `${pokemon.oldName}'s name was changed to ${pokemon.nickname}!`,
        image: pokemon.url
    }

    return EmbedBuilder.build(msg, embed);
}