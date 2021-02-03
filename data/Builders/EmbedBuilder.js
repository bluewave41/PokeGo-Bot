const Discord = require('discord.js');

module.exports = {
    build(msg, embedObject, originalEmbed=null) {
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
            else {
                embed.attachFiles({name: `image.png`, attachment: Buffer.from(embedObject.image)})
                embed.setImage(`attachment://image.png`)
            }
        }
        //unused
        if(embedObject.base64) {
            embed.attachFiles({name: `image.png`, attachment: Buffer.from(embedObject.base64, 'base64')})
            embed.setImage(`attachment://image.png`)
        }
        /*Still need this for when the user selects a team*/
        if(embedObject.color) {
            embed.setColor(embedObject.color);
        }
        if(embedObject.thumbnail) {
            embed.setThumbnail(embedObject.thumbnail);
        }
        if(embedObject.fields) {
            embed.fields = [];
            for(var i=0;i<embedObject.fields.length;i++) {
                embed.addField(embedObject.fields[i][0], embedObject.fields[i][1], embedObject.fields[i][2]);
            }
        }
        if(embedObject.footer) {
            embed.setFooter(embedObject.footer);
        }
        return embed;
    },
    edit(msg, embed) {
        let message = msg.channel.messages.cache.get(msg.lastMessageId);
        if(message) {
            message.edit(this.build(msg, embed, message.embeds[0]));
        }
        else {
            return this.build(msg, embed);
        }
    },
}