const axios = require('axios');
const EncounterBuilder = require('../EncounterBuilder');
const EmbedBuilder = require('../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'item/use', {userId: msg.userId, name: msg.parameters.join('')});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    console.log(response.data);

    if(response.data.type == 'update') { //used an item during an encounter so we need to update the embed
        const embed = EncounterBuilder.build(response.data);
        return EmbedBuilder.edit(msg, embed);
    }
}