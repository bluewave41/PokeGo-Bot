const Pokemon = require('./Pokemon');

class CurrentEncounters extends Pokemon {
	static get tableName() {
		return 'current_encounters';
    }
    static get virtualAttributes() {
        return ['url', 'emoji', 'name'];
    }
}

module.exports = CurrentEncounters;