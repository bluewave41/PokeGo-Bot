const News = require('~/knex/models/News');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('../Command');
const CustomError = require('~/lib/errors/CustomError');

const options = {
    names: [],
    expectedParameters: [
        { name: 'articleId', type: ['number'], optional: false}
    ],
    reset: true,
}

class ViewArticle extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const article = await News.query().select('title', 'body', 'created_at')
            .where('id', this.articleId).first();
        if(!article) {
            throw new CustomError('INVALID_NEWS_ARTICLE');
        }

        const embed = {
            title: article.title,
            description: article.body,
            footer: article.created_at.toString().substring(0, 10)
        }
        
        super.run();
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options, class: ViewArticle
}