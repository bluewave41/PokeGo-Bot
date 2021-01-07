const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/inventory', {userId: msg.userId});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }
    let description = '';
    let fields = [];

    if(response.data.length == 0) {
        description = 'You have no items.';
    }
    else {
        for(var i=0;i<response.data.length;i++) {
            let item = response.data[i];
            fields.push([item.emoji + ' ' + item.name, 'Count: ' + item.amount, false]);
        }
    }

    let embed = {
        title: 'Inventory',
        description: description,
        fields: fields,
    }

    return EmbedBuilder.build(msg, embed);
}