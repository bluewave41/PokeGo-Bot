const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const axios = require('axios');
const crypto = require('crypto');

module.exports = {
    async show(msg, parameters) {
        const p1 = parameters.p1;
        const p2 = parameters.p2;
        const p1Shields = parameters.p1Shields;
        const p2Shields = parameters.p2Shields;
        const id = crypto.randomBytes(3).toString('hex');
        //create the initial battle image

        const embed = {
            title: parameters.title,
            description: parameters.description,
            fields: [
                [p1.name, `HP: ${p1.hp}/${p1.maxHP}\nEnergy: ${p1.energy}/${p1.requiredChargeEnergy}`, true],
                [p2.name, `HP: ${p2.hp}/${p2.maxHP}`, true]
            ],
        }

        if(parameters.generate) {
            await axios.post(process.env.url + 'api/image/generate', { userId: msg.userId, p1: p1, p2: p2,
                p1Shields: p1Shields, p2Shields: p2Shields });
            embed.image = process.env.url + `battle/${msg.userId}.png?=${id}`
        }

        return EmbedBuilder.edit(msg, embed);
    }
}