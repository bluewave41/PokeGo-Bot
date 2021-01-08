const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/pokemon/transfer', {userId: msg.userId, choice: msg.content});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let pokemon = response.data;

    const embed = {
        title: 'Transfer',
        description: `You transfered ${pokemon.name}. You received:\n- 1 candy`,
        image: pokemon.url
    }

    return EmbedBuilder.build(msg, embed);
}