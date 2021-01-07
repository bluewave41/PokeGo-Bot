const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'debug/givePokemon', {userId: msg.userId, pokemonId: msg.parameters[0], amount: msg.parameters[1]});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let pokemon = response.data;

    const embed = {
        title: 'Pokemon Given',
        description: `Added ${msg.parameters[1]} ${pokemon.name}.`,
        image: pokemon.url
    }

    return EmbedBuilder.build(msg, embed);
}