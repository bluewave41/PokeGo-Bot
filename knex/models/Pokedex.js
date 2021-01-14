const { Model } = require('objection');

class Pokedex extends Model {
	static get tableName() {
		return 'pokedex';
    }
}

module.exports = Pokedex;