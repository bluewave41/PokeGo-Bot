const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const NewsCommands = require('~/data/ModelHandlers/NewsCommands');
const User = require('~/knex/models/User');

const options = {
    names: ['news'],
    expectedParameters: [],
    pagination: {
        emojis: ['⬅️', '➡️'],
        maxEntries: 25
    }
}

class NewsCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.articles = await NewsCommands.getNewsArticles(1, this.pagination.maxEntries);
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

        await User.setNextCommand(this.msg.userId, 'news/ViewArticle');
        
        for(var i=0;i<this.articles.length;i++) {
            let article = this.articles[i];
            description += i+1 + ': **' + article.title + '** - *' + article.created_at.toString().substring(0, 10) + '*\n';
        }
    
        return EmbedBuilder.build(this.msg, {
            title: 'News',
            description: description,
            footer: `Page 1 of ${Math.ceil(this.pagination.entryCount/this.pagination.maxEntries)} - ${this.pagination.entryCount} results.`
        });
    }
}

module.exports = {
    options: options,
    class: NewsCommand,
}