const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'owner/reset', {userId: msg.userId});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let embed = {
        title: 'Reset',
        description: 'You have been reset.'
    }

    return EmbedBuilder.build(msg, embed);
}