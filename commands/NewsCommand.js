const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const NewsCommands = require('~/data/ModelHandlers/NewsCommands');
const User = require('~/knex/models/User');

const options = {
    names: ['news'],
    expectedParameters: [],
    pagination: {
        emojis: ['⬅️', '➡️'],
        MAX_ENTRIES: 25
    }
}

class NewsCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.articles = await NewsCommands.getNewsArticles(1, this.pagination.MAX_ENTRIES);
        this.pagination.entryCount = this.articles.length ? this.articles[0].count : 0;
    }
    async run() {
        let description = '';

        if(!this.articles.length) {
            return EmbedBuilder.build(this.msg, {
                title: 'News',
                description: "There are currently no news articles."
            });
        }

        await User.query().update({
            nextCommand: 'news/ViewArticle'
        })
        .where('userId', this.msg.userId);
        
        for(var i=0;i<this.articles.length;i++) {
            let article = this.articles[i];
            description += i+1 + ': **' + article.title + '** - *' + article.created_at.toString().substring(0, 10) + '*\n';
        }
    
        return EmbedBuilder.build(this.msg, {
            title: 'News',
            description: description,
            footer: `Page 1 of ${Math.ceil(this.pagination.entryCount/this.pagination.MAX_ENTRIES)} - ${this.pagination.entryCount} results.`
        });
    }
}

module.exports = {
    options: options,
    class: NewsCommand,
}