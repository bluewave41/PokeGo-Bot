const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');

module.exports = async function(msg) {
    let response = await axios.post(process.env.url + 'user/pokemon/favorite', {userId: msg.userId, pokemonId: msg.parameters[0]});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let pokemon = response.data;

    let embed = {
        title: 'Favorite',
        description: `${pokemon.name} was ` + ((pokemon.favorite) ? 'added to ' : 'removed from ') + 'your favorites list!',
        image: pokemon.url,
    }

    return EmbedBuilder.build(msg, embed);
}