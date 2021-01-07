const axios = require('axios');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'owner/createRedeemCode', {userId: msg.userId, rewards: msg.parameters});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const code = response.data.redeemId;

    return `Created ${code}.`;
}