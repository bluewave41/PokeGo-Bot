const { Model } = require('objection');

class Rockets extends Model {
	static get tableName() {
		return 'rockets';
    }
}

module.exports = Rockets;