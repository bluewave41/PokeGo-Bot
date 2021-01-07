const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');
const Emojis = require('../Emojis');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/daily', {userId: msg.userId});
    if(response.data.error) {
        let embed = {
            title: 'Daily',
            description: response.data.error,
        }
        return EmbedBuilder.build(msg, embed);
    }

    const { streak, currency, received } = response.data;

    let embed = {
        title: 'Daily',
        description: `You're on a ${streak} day streak and you received ${received} ${Emojis.COIN}!`,
        footer: `New total: ${currency}.`
    }

    return EmbedBuilder.build(msg, embed);
}