const { Model } = require('objection');

class TeamListings extends Model {
    static get tableName() {
		return 'team_listings';
    }
}

module.exports = TeamListings;