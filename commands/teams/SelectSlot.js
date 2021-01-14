const axios = require('axios');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/teams/selectSlot', { userId: msg.userId, slot: msg.content });
    if(response.data.error) {
        return { error: true, message: response.data.error }
    }
}