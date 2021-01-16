const User = require('~/knex/models/User');
const Command = require('./Command');

const options = {
    names: ['sql'],
    ownerOnly: true,
    expectedParameters: [
        { name: 'sql', type: ['rest'], ofType: 'any', separator: ' ', optional: false }
    ],
    global: true,
}

class SQLCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        await User.knex().raw(this.sql);
    }
}

module.exports = {
    options: options,
    class: SQLCommand,
}