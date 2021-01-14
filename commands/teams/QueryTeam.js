const axios = require('axios');
const EmbedBuilder = require('~/data/Lists/EmojiList');

module.exports = async function(msg) {

    /*Valid commands
        create teamname
        delete teamname
        integer to select team
    */
    let command = msg.parameters[0];
    switch(command) {
        case 'create':
            const name = msg.parameters.slice(1).join(' ');
            const response = await axios.post(process.env.url + 'user/teams/create', { userId: msg.userId, name: name });
            if(response.data.error) {
                return { error: true, message: response.data.error }
            }

            const embed = {
                title: response.data.name,
                description: 'Select a slot',
                fields: [['1', 'Empty', true], ['2', 'Empty', true], ['3', 'Empty', true]]
            }
            return EmbedBuilder.edit(msg, embed);
    }
}