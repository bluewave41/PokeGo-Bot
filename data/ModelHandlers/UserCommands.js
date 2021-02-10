const { raw } = require('objection');
const User = require('~/knex/models/User');
const LevelTable = require('~/data/Lists/LevelList');
const MailCommands = require('./MailCommands');

module.exports = {
    async addXP(userId, xp) {
        let user = await User.query().select('level', 'xp', 'team')
            .where('userId', userId).first();
        
        let newXP = user.xp + xp;
        let level = user.level;
        let requiredXPForLevel = LevelTable[level].requiredXP;

        while(newXP >= requiredXPForLevel) {
            newXP -= requiredXPForLevel;
            requiredXPForLevel = LevelTable[++level].totalXP;
            await MailCommands.addLevelUpMail(userId, level);
            if(!user.team && level >= 5) { //send team message if they don't belong to a team
                try {
                    await MailCommands.addTeamMail(userId);
                }
                catch(e) {}
            }
        }

        await User.query().update({
            xp: newXP,
            totalxp: raw('?? + ??', ['totalxp', xp]),
            level: level
        });
    },
    async getSaved(userId) {
        const saved = await User.query().select('saved')
            .where('userId', userId)
            .first();
        //this fails on linux for some reason
		if(process.platform.startsWith('win')) {
			return JSON.parse(saved.saved);
		}
        return saved.saved;
    },
    /**
     * Updates a column in the User table of the databae.
     * @param {Integer} userId msg.userId
     * @param {Array > objects} options Array of objects containing column to change, value to change it to and flags.
     */
    async update(userId, options) {
        const values = [].concat(options || []);
        let query = User.query();
        let updateObject = {};
        for(var i=0;i<values.length;i++) {
            let row = values[i];
            if(row.flag) {
                switch(row.flag) {
                    case 'increment':
                        updateObject[row.rowName] = raw(`${row.rowName} + ${row.value}`);
                        break;
                    case 'decrement':
                        updateObject[row.rowName] = raw(`${row.rowName} - ${row.value}`);
                        break;
                    case 'json':
                        updateObject[row.rowName] = JSON.stringify(row.value);
                        break;
                }
            }
            else {
                updateObject[row.rowName] = row.value;
            }
        }
        await User.query().update(updateObject)
            .where('userId', userId);
        await query;
    },
    async getFields(userId, columnNames) {
        const rowNames = [].concat(columnNames || []);
        let query = User.query();
        query.where('userId', userId);
        for(var i=0;i<rowNames.length;i++) {
            query.select(rowNames[i]);
        }
        return await query.first();
    },
    async updateSaved(userId, classType, value) {
        value.classType = classType;
        await User.query().update({
            saved: JSON.stringify(value)
        })
        .where('userId', userId);
    },
    async reset(userId) {
        await User.query().update({
            nextCommand: null,
            saved: null
        })
        .where('userId', userId);
    }
}