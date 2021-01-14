const User = require('~/knex/models/User');
const Command = require('./Command');

const options = {
    names: ['sql'],
    ownerOnly: true,
    expectedParameters: [
        { name: 'sql', type: 'rest', optional: false }
    ]
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