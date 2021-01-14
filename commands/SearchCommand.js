const axios = require('axios');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const SpriteListBuilder = require('~/data/Builders/SpriteListBuilder');

module.exports = async function(msg) {
    let response = await axios.post(process.env.url + 'map/pokemon', {userId: msg.userId});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    console.log(response.data);

    let embed = {
        title: 'Pokemon in the area',
        description: SpriteListBuilder.build(response.data.sprites)
    }

    return EmbedBuilder.build(msg, embed);
}