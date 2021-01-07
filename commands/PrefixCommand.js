const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');

module.exports = async function(msg) {
    if(!msg.member.hasPermission('MANAGE_GUILD')) {
        return "You need manage guild permissions to change the prefix.";
    }
    const response = await axios.post(process.env.url + 'server/changePrefix', {userId: msg.userId, prefix: msg.parameters[0], serverId: msg.guild.id});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const embed = {
        title: 'Prefix Changed',
        description: `This servers prefix has been changed to ${msg.parameters[0]}.`
    }

    return EmbedBuilder.build(msg, embed);
}