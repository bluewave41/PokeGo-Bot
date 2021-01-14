const axios = require('axios');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'debug/battle', { userId: msg.userId });
    if(response.data.error) {
        return { error: true, message: response.data.error }
    }
}