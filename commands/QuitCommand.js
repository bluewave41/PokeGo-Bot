const axios = require('axios');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/quit', {userId: msg.userId, nextCommand: msg.nextCommand});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const embed = {
        title: 'Quit',
        description: `You quit.`
    }

    return EmbedBuilder.build(msg, embed);
}