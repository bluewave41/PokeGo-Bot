const axios = require('axios');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/redeem', {userId: msg.userId, code: msg.parameters[0]});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }
}