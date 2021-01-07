const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    let page = msg.parameters[0];
    if(!page) {
        page = 1;
    }
    const response = await axios.post(process.env.url + 'user/pokedex/showPage', {userId: msg.userId, page: page});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let embed = {
        title: 'Pokedex',
        description: 'Pokedex',
    }

    let fields = [];

    for(var i=0;i<response.data.length;i++) {
        let pokemon = response.data[i];
        fields.push([pokemon.name, `${pokemon.emoji}\nSeen: ${pokemon.seen}\nCaught: ${pokemon.caught}`, true])
    }

    embed.fields = fields;

    return EmbedBuilder.build(msg, embed);
}