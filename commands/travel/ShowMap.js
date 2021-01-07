const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    if(msg.parameters.length) {
        let response = await axios.post(process.env.url + 'map/setLocation', {userId: msg.userId, location: msg.parameters[0]});
        if(response.data.error) {
            return { error: true, message: response.data.error };
        }
    
        let embed = {
            title: 'Location Changed',
            description: `Your location has been changed to ${msg.parameters[0]}!`,
        }
    
        return EmbedBuilder.build(msg, embed);
    }
    else {
        let response = await axios.post(process.env.url + 'map/changeLocation', {userId: msg.userId});
        if(response.data.error) {
            return { error: true, message: response.data.error };
        }
    
        let embed = {
            title: 'Map',
            description: `Where would you like to go?\nMoving up, down, left or right takes 5 minutes.\n**Current position: ** ${msg.location}`,
            base64: response.data,
        }

        return EmbedBuilder.build(msg, embed);
    }
}