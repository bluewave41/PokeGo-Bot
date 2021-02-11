const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('../Command');
const CustomError = require('~/lib/errors/CustomError');
const NewsCommands = require('~/data/ModelHandlers/NewsCommands');
const User = require('~/knex/models/User');

const options = {
    names: [],
    expectedParameters: [
        { name: 'articleId', type: ['number'], optional: false}
    ],
    canQuit: true,
    info: 'Viewing news articles',
    pagination: {
        emojis: ['⬅️', '➡️'],
        MAX_ENTRIES: 25
    }
}

class ViewArticle extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async buildNewPage(page) {
        const articles = await NewsCommands.getNewsArticles(page, this.pagination.MAX_ENTRIES);

        let embed = {
            title: 'News',
            description: '',
            footer: `Page ${page} of ${Math.ceil(articles[0].count/this.pagination.MAX_ENTRIES)} - ${articles[0].count} results.`
        }
    
        if(!articles.length) {
            embed.description = 'There are currently no news articles.';
            return embed;
        }

        for(var i=0;i<articles.length;i++) {
            let article = articles[i];
            embed.description += i+(page-1)*25+1 + ': **' + article.title + '** - *' + article.created_at.toString().substring(0, 10) + '*\n';
        }

        return EmbedBuilder.edit(this.msg, embed);
    }
    async run() {
        const article = await NewsCommands.getArticle(this.articleId);

        if(!article) {
            throw new CustomError('INVALID_NEWS_ARTICLE');
        }

        const embed = {
            title: article.title,
            description: article.body,
            footer: article.created_at.toString().substring(0, 10)
        }

        await User.reset(this.msg.userId);
        
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options, class: ViewArticle
}