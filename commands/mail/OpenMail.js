const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/mail/open', {userId: msg.userId, tableId: msg.content});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    await axios.post(process.env.url + 'user/setNextCommand', {userId: msg.userId, nextCommand: 'mail/ClaimRewards', saved: msg.content});

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