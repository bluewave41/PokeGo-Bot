module.exports = {
    build(mail, page) {
        let embed = {
            title: 'Mail',
            description: '',
        }
    
        if(!mail.length) {
            embed.description = 'You have no mail.';
            return embed;
        }

        embed.footer = `Page ${page} of ${Math.ceil(mail[0].count/25)} - ${mail[0].count} results.`

        for(var i=0;i<mail.length;i++) {
            console.log(mail[i])
            embed.description += `${i+(page-1)*25+1}: ${mail[i].title} ${mail[i].read ? ':no_bell:' : ':bell:'}`;
            if(mail[i].hasRewards && !mail[i].claimedRewards) {
                embed.description += ':exclamation:';
            }
            embed.description += '\n';
        }

        return embed;
    }
}