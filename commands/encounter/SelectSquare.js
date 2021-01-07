const axios = require('axios');
const EncounterBuilder = require('EncounterBuilder');
const EmbedBuilder = require('EmbedBuilder');

module.exports = async function(msg) {
    console.log(msg.lastMessageId);
    const response = await axios.post(process.env.url + 'encounter/throw', {userId: msg.userId, square: msg.content})
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let embed = EncounterBuilder.build(response.data);

    let message = msg.channel.messages.cache.get(msg.lastMessageId);
    if(message) {
        message.edit(EmbedBuilder.build(msg, embed));
    }
    else {
        return EmbedBuilder.build(msg, embed);
    }
}