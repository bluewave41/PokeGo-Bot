const { Model } = require('objection');

class Caught extends Model {
	static get tableName() {
		return 'caught';
    }
}

module.exports = Caught;