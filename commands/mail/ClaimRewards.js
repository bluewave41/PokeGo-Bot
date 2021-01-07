const axios = require('axios');
const EmbedBuilder = require('EmbedBuilder');

module.exports = async function(msg) {
    if(msg.content.toLowerCase() == 'claim') {
        const {data: tableId} = await axios.post(process.env.url + 'user/getSaved', {userId: msg.userId});

        const response = await axios.post(process.env.url + 'user/mail/claim', {userId: msg.userId, tableId: tableId});
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
    await axios.post(process.env.url + 'user/reset', {userId: msg.userId});
}