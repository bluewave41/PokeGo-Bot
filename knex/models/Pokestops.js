const { Model } = require('objection');

class Pokestops extends Model {
    static get tableName() {
		return 'pokestops';
    }
}

module.exports = Pokestops;