const News = require('~/knex/models/News');
const { raw } = require('objection');

module.exports = {
    async getNewsArticles(page, numberOfEntries) {
        return await News.query().select('title', 'created_at', raw('COUNT(*) OVER() AS count'))
        .orderBy('created_at', 'DESC')
        .limit(numberOfEntries)
        .offset((page-1)*numberOfEntries);
    },
    async getArticle(articleId) {
        return await News.query().select('title', 'body', 'created_at')
            .orderBy('created_at', 'DESC')
            .limit(1)
            .offset(articleId-1)
            .first();
    }
}