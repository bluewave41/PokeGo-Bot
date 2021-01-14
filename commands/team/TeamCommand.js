const axios = require('axios');
const EmbedBuilder = require('~/data/Lists/EmojiList');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/team/list', {userId: msg.userId});
    if(response.data.error) {
        return { error: true, message: response.data.error }
    }

    let description = '';
    for(var i=0;i<response.data.length;i++) {
        let team = response.data[i];
        description += `${i+1}. ${team.name} ${team.emoji}\n`
    }

    const embed = {
        title: 'Select a team',
        description: description,
    }

    return EmbedBuilder.build(msg, embed);
}