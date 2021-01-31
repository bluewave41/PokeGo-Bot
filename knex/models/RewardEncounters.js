const { Model } = require('objection');

class RewardEncounters extends Model {
	static get tableName() {
		return 'reward_encounters';
    }
}

module.exports = RewardEncounters;