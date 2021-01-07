const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/team/select', {userId: msg.userId, choice: msg.content});
    if(response.data.error) {
        return { error: true, message: response.data.error }
    }

    const data = response.data;

    const embed = {
        title: 'Team selected',
        description: `Congratulations! You're now a member of team ${data.team.name} ${data.team.emoji}!`,
        color: data.color,
    }

    return EmbedBuilder.build(msg, embed);
}