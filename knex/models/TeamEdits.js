const { Model } = require('objection');

class TeamEdits extends Model {
	static get tableName() {
		return 'team_edits';
    }
    static get relationMappings() {
        const Teams = require('./Teams');
        return {
            team: {
                relation: Model.HasOneRelation,
                modelClass: Teams,
                join: {
                    from: 'team_edits.userId',
                    to: 'player_teams.userId'
                }
            }
        }
    }
}

module.exports = TeamEdits;