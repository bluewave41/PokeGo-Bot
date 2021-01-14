const axios = require('axios');
const EmbedBuilder = require('~/data/Lists/EmojiList');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/mail/open', {userId: msg.userId, tableId: msg.content});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const rewards = response.data.rewards;
    let fields = [];

    for(var i=0;i<rewards.length;i++) {
        fields.push([rewards[i].name, rewards[i].amount, false]);
    }

    const embed = {
        title: response.data.title,
        description: response.data.message,
        fields: fields,
    }

    return EmbedBuilder.edit(msg, embed);
}