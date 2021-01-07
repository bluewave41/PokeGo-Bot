const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');
const Emojis = require('../Emojis');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/medals', {userId: msg.userId});
    if(response.data.error) {
        return { error: response.data.error }
    }

    let fields = [];

    for(var i=0;i<response.data.length;i++) {
        let medal = response.data[i];
        let field = [medal.name, medal.description + '\n' + medal.amount + '/' + medal.target, true];
        if(medal.tier != 'NONE') {
            console.log(medal.tier);
            field[0] += ' ' + Emojis[medal.tier];
        }
        fields.push(field);
    }

    const embed = {
        title: 'Medals',
        description: 'Medals',
        fields: fields,
    }

    return EmbedBuilder.build(msg, embed);
}