const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('./Command');
const News = require('~/knex/models/News');
const UserCommands = require('~/data/ModelHandlers/UserCommands');

const options = {
    names: ['news'],
    expectedParameters: [],
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
            return EmbedBuilder.build(this.msg, {
                title: 'News',
                description: "There are currently no news articles."
            });
        }

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'news/ViewArticle' }
        ]);
        
        for(var i=0;i<titles.length;i++) {
            description += i+1 + ': **' + titles[i].title + '** - *' + titles[i].created_at.toString().substring(0, 10) + '*\n';
        }
    
        const embed = {
            title: 'News',
            description: description
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: NewsCommand,
}