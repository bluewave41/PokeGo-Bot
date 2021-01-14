const { Model } = require('objection');

class TravelRequests extends Model {
    static get tableName() {
		return 'travel_requests';
    }
}

module.exports = TravelRequests;