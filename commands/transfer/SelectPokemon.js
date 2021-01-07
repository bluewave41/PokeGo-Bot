const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/pokemon/promptTransfer', {userId: msg.userId, pokemonId: msg.parameters[0]});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    await axios.post(process.env.url + 'user/setNextCommand', {userId: msg.userId, nextCommand: 'transfer/ConfirmTransfer'});

    let pokemon = response.data;

    let embed = {
        title: 'Transfer',
        description: `Are you sure you wish to transfer ${pokemon.name}?`,
        image: pokemon.url,
        footer: 'Y or yes to confirm, anything else to cancel.'
    }

    return EmbedBuilder.build(msg, embed);
}