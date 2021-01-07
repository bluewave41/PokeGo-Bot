const axios = require('axios');
const EmbedBuilder = require('../../EmbedBuilder');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'status/getArticle', {userId: msg.userId, articleId: msg.content});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    const article = response.data;

    const embed = {
        title: article.title,
        description: article.body,
        footer: article.created_at.substring(0, 10)
    }

    return EmbedBuilder.build(msg, embed);
}