const { Model } = require('objection');

class RedeemedCodes extends Model {
	static get tableName() {
		return 'redeemed_codes';
    }
}

module.exports = RedeemedCodes;