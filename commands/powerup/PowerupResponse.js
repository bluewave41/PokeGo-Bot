const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');
const PowerupBuilder = require('./PowerupBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/pokemon/powerup/response', { userId: msg.userId, response: msg.content });
    if(response.data.error) {
        return { error: true, message: response.data.error }
    }

    if(response.data.quit) {
        const embed = {
            title: 'Quit',
            description: `You exited the powerup menu.`
        }
        return EmbedBuilder.build(msg, embed);
    }

    return EmbedBuilder.edit(msg, PowerupBuilder.build(msg, response.data));
}