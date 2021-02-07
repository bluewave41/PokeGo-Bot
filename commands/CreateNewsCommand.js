const Command = require('./Command');
const News = require('~/knex/models/News');
const Utils = require('~/lib/Utils');

const options = {
    names: ['createNews'],
    expectedParameters: [
        { name: 'amount', type: 'number', optional: false }
    ],
    ownerOnly: true,
}

class CreateNewsCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        let values = [];
        let date = new Date();
        for(var i=0;i<this.amount;i++) {
            values.push({
                title: Utils.generateRandomString(10),
                body: Utils.generateRandomString(30),
                created_at: new Date(date.getTime() + (1000 * i))
            });
        }
        await News.knex().table('news').insert(values);
    }
}

module.exports = {
    options: options,
    class: CreateNewsCommand,
}