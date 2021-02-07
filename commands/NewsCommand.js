const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const NewsCommands = require('~/data/ModelHandlers/NewsCommands');

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
        this.entryCount = this.articles.length ? this.articles[0].count : 0;
    }
    async run() {
        let description = '';

        if(!this.articles.length) {
            return EmbedBuilder.build(this.msg, {
                title: 'News',
                description: "There are currently no news articles."
            });
        }

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'news/ViewArticle' }
        ]);
        
        for(var i=0;i<this.articles.length;i++) {
            let article = this.articles[i];
            description += i+1 + ': **' + article.title + '** - *' + article.created_at.toString().substring(0, 10) + '*\n';
        }
    
        return EmbedBuilder.build(this.msg, {
            title: 'News',
            description: description,
            footer: `Page 1 of ${Math.ceil(this.entryCount/this.pagination.MAX_ENTRIES)} - ${this.entryCount} results.`
        });
    }
}

module.exports = {
    options: options,
    class: NewsCommand,
}