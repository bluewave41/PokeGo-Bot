const { Model } = require('objection');

class Candy extends Model {
	static get tableName() {
		return 'powerups';
    }
}

module.exports = Candy;