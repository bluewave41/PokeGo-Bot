const { Model } = require('objection');

class RedeemCodes extends Model {
	static get tableName() {
		return 'redeemcodes';
    }
    static get idColumn() {
        return 'redeemId';
    }
}

module.exports = RedeemCodes;