const { Model } = require('objection');

class SeenEncounters extends Model {
	static get tableName() {
		return 'seen_encounters';
    }
}

module.exports = SeenEncounters;