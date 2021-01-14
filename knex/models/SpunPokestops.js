const { Model } = require('objection');

class SpunPokestops extends Model {
    static get tableName() {
		return 'spun_pokestops';
    }
}

module.exports = SpunPokestops;