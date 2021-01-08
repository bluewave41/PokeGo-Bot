const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/mail/list', {userId: msg.userId});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const mail = response.data;

    let embed = {
        title: 'Mail',
        description: ''
    }

    if(!mail.length) {
        embed.description = 'You have no mail.';
    }
    else {
        for(var i=0;i<mail.length;i++) {
            embed.description += `${i+1}: ${mail[i].title} ${mail[i].read ? ':no_bell:' : ':bell:'}\
                ${mail[i].claimedrewards ? '' : ':exclamation:'}\n`; 
        }
    }

    return EmbedBuilder.build(msg, embed);
}