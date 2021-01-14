const { Model } = require('objection');
const MedalList = require('~/data/Lists/MedalList');

class Medals extends Model {
	static get tableName() {
		return 'medals';
    }
    get multiplier() {
        const medal = MedalList.find(el => el.id == this.medalId);
        if(medal) {
            if(this.amount >= medal.platinum) {
                return 1.4
            }
            else if(this.amount >= medal.gold) {
                return 1.3;
            }
            else if(this.amount >= medal.silver) {
                return 1.2;
            }
            else if(this.amount >= medal.bronze) {
                return 1.1;
            }
            else {
                return 1;
            }
        }
        return null;
    }
}

module.exports = Medals;