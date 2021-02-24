const RedeemCodes = require('~/knex/models/RedeemCodes');
const Command = require('./Command');
const Utils = require('~/lib/Utils');

const options = {
    names: ['createRedeemCode'],
    expectedParameters: [
        { name: 'rewards', type: 'string', optional: false }
    ],
    ownerOnly: true,
    global: true,
}

class CreateRedeemCodeCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const column = await RedeemCodes.query().insertAndFetch({
            redeemId: Utils.generateRandomString(20),
            rewards: this.rewards,
        });

        return `Created ${column.redeemId}.`;
    }
}

module.exports = {
    options: options,
    class: CreateRedeemCodeCommand
}