const { Model } = require('objection');

class Teams extends Model {
	static get tableName() {
		return 'player_teams';
    }
}

module.exports = Teams;