const { Model } = require('objection');

class MailRewards extends Model {
	static get tableName() {
		return 'mail_rewards';
    }
}

module.exports = MailRewards;