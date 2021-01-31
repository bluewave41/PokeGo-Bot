const Discord = require('discord.js');

module.exports = {
    build(msg, pokemon1, pokemon2, embedObject, originalEmbed=null) {
        const embed = originalEmbed ? new Discord.MessageEmbed(originalEmbed) : new Discord.MessageEmbed()
        .setColor(msg.color);

        if(embedObject.title) {
            embed.setTitle(embedObject.title);
        }
        if(embedObject.description) {
            embed.setDescription(embedObject.description);
        }
        if(typeof embedObject.image != 'undefined') {
            if(typeof embedObject.image == 'string') {
                embed.setImage(embedObject.image);
            }
            else if(!embedObject.image) {
                embed.setImage(null);
            }
        }
        if(embedObject.fields) {
            embed.fields = [];
            for(var i=0;i<embedObject.fields.length;i++) {
                embed.addField(embedObject.fields[i][0], embedObject.fields[i][1], embedObject.fields[i][2]);
            }
        }
        else {
            //set fields to HP by default
            embed.fields = [];
            embed.addField(pokemon1.name, `HP: ${pokemon1.hp}/${pokemon1.maxHP}\nEnergy: ${pokemon1.energy}/${pokemon1.requiredChargeEnergy}`, true);
            embed.addField(pokemon2.name, `HP: ${pokemon2.hp}/${pokemon2.maxHP}`, true);
        }
        if(embedObject.footer) {
            embed.setFooter(embedObject.footer);
        }
        return embed;
    },
    edit(msg, pokemon1, pokemon2, embed) {
        console.log('EDIT CALLED');
        let message = msg.channel.messages.cache.get(msg.lastMessageId);
        if(message) {
            message.edit(this.build(msg, pokemon1, pokemon2, embed, message.embeds[0]));
        }
        else {
            return this.build(msg, pokemon1, pokemon2, embed);
        }
    },
}