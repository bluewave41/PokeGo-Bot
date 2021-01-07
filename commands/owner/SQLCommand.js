const axios = require('axios');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'owner/sql', {userId: msg.userId, sql: msg.parameters.join(' ')});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }
}