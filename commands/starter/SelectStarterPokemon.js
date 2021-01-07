const EmbedBuilder = require('../../EmbedBuilder');
const axios = require('axios');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'starter/selectStarter', {userId: msg.userId, starter: msg.content});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }
        
    let pokemon = response.data;
    let embed = {
        title: 'Starter',
        description: `Congratulations! You obtained a level ${pokemon.level} ${pokemon.name}!`,
        image: pokemon.url
    }
    return EmbedBuilder.build(msg, embed);
}