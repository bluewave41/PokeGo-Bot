const { Model } = require('objection');

class Candy extends Model {
	static get tableName() {
		return 'candy';
    }
}

module.exports = Candy;