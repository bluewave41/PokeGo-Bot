const axios = require('axios');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/pokemon/evolve', {userId: msg.userId, pokemonId: msg.parameters[0]});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const pokemon = response.data.pokemon;

    const embed = {
        title: 'Evolution',
        description: `Congratulations! Your ${response.data.oldName} evolved into ${pokemon.originalName}!`,
        image: pokemon.url,
        footer: `Remaining candy: ${response.data.remainingCandy}`,
    }

    return EmbedBuilder.build(msg, embed);
}