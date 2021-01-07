const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    let response = await axios.post(process.env.url + 'map/setLocation', {userId: msg.userId, location: msg.content});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let embed = {
        title: 'Travelling',
        description: `You're moving to ${response.data.location}. You'll be there in ${response.data.time} minutes.`,
    }

    return EmbedBuilder.build(msg, embed);
}