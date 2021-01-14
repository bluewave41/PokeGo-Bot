const axios = require('axios');
const EmbedBuilder = require('~/data/Lists/EmojiList');
const PowerupBuilder = require('./PowerupBuilder');

module.exports = async function(msg) {
    const data = {
        userId: msg.userId,
        pokemonId: msg.parameters[0],
    }
    const response = await axios.post(process.env.url + 'user/pokemon/powerup/menu', data);
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    return EmbedBuilder.build(msg, PowerupBuilder.build(msg, response.data));
} 