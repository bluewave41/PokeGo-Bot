module.exports = {
    build(articles, page) {
        let embed = {
            title: 'News',
            description: '',
        }
    
        if(!articles.length) {
            embed.description = 'There are currently no news articles.';
            return embed;
        }

        for(var i=0;i<articles.length;i++) {
            let article = articles[i];
            description += i+1 + ': **' + article.title + '** - *' + article.created_at.toString().substring(0, 10) + '*\n';
        }

        embed.footer = `Page ${page} of ${Math.ceil(articles[0].count/25)} - ${mail[0].count} results.`

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