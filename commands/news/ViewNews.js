const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'status/news', {userId: msg.userId});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const titles = response.data;

    let description = '';

    if(!titles.length) {
        description = "There are currently no news articles.";
    }
    
    for(var i=0;i<titles.length;i++) {
        description += i+1 + ': **' + titles[i].title + '** - *' + titles[i].created_at.substring(0, 10) + '*\n';
    }

    const embed = {
        title: 'News',
        description: description
    }

    return EmbedBuilder.build(msg, embed);
}