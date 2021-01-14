const axios = require('axios');
const EmbedBuilder = require('~/data/Lists/EmojiList');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/teams/list', { userId: msg.userId });
    if(response.data.error) {
        return { error: true, message: response.data.error }
    } 
    
    const embed = {
        title: 'Teams',
        description: 'You have no teams.',
        footer: `Create a team with create teamname`,
    }

    if(response.data.length) {
        //show teams
    }

    return EmbedBuilder.build(msg, embed);
}