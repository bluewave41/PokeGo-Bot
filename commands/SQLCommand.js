const User = require('~/knex/models/User');
const Command = require('./Command');

const options = {
    names: ['sql'],
    ownerOnly: true,
    expectedParameters: [
        { name: 'type', type: 'string', possble: ['safe', 'unsafe'], optional: false },
        { name: 'id', type: 'string', possible: el => el.includes('id'), optional: true },
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
        if(this.type == 'safe') {
            if(!this.id) {
                return;
            }
            if(this.sql.includes('where')) {
                await User.knex().raw(this.sql + ` and ${this.id} = ${this.msg.userId}`);
            }
            else {
                await User.knex().raw(this.sql + ` where ${this.id} = ${this.msg.userId}`);
            }
        }
        else {
            await User.knex().raw(this.sql);
        }
    }
}

module.exports = {
    options: options,
    class: SQLCommand,
}