const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const News = require('~/knex/models/News');

const options = {
    names: ['news'],
    expectedParameters: [],
    nextCommand: 'news/ViewArticle',
}

class NewsCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const titles = await News.query().select('title', 'created_at');

        let description = '';

        if(!titles.length) {
            description = "There are currently no news articles.";
        }
        
        for(var i=0;i<titles.length;i++) {
            description += i+1 + ': **' + titles[i].title + '** - *' + titles[i].created_at.toString().substring(0, 10) + '*\n';
        }
    
        const embed = {
            title: 'News',
            description: description
        }
    
        super.run();
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: NewsCommand,
}