const axios = require('axios');
const EmbedBuilder = require('EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/mail/claim', { userId: msg.userId, choice: msg.content });
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const rewards = response.data;
    let description = 'You received: \n';

    for(var i=0;i<rewards.length;i++) {
        description += rewards[i].amount + ' ' + rewards[i].name + '\n';
    }

    const embed = {
        title: 'Claimed',
        description: description
    }

    return EmbedBuilder.edit(msg, embed);
}