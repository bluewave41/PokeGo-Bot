const EmbedBuilder = require('../../EmbedBuilder');
const axios = require('axios');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'starter/list', {userId: msg.userId});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let starters = response.data;
    starters.forEach(el => el.push(false));

	let embed = {
		title: 'Starter',
		description: 'Select a Pokemon:',
		fields: starters,
	}
	return EmbedBuilder.build(msg, embed);
}