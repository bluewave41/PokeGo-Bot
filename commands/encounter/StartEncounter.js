const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');
const EncounterBuilder = require('EncounterBuilder');
const ItemListBuilder = require('../../ItemListBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'encounter/start', {userId: msg.userId, position: msg.content});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    console.log(response.data);

    let embed;

    switch(response.data.type) {
        case 'pokemon':
            embed = EncounterBuilder.build(response.data);
            return EmbedBuilder.build(msg, embed);
        case 'pokestop':
            const items = response.data.items;
            embed = {
                title: 'Items',
                description: 'You received: \n' + ItemListBuilder.build(items),
            }
            return EmbedBuilder.build(msg, embed);
    }
}