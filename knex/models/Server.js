const { Model } = require('objection');

class Server extends Model {
	static get tableName() {
		return 'servers';
	}
}

module.exports = Server;