const { Model } = require('objection');

class Mail extends Model {
	static get tableName() {
		return 'mail';
    }
    static get relationMappings() {
        const MailRewards = require('~/knex/models/MailRewards');
        return {
            rewards: {
                relation: Model.HasManyRelation,
                modelClass: MailRewards,
                join: {
                    from: 'mail.id',
                    to: 'mail_rewards.mailId',
                }
            }
        }
    }
}

module.exports = Mail;