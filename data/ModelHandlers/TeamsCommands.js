const Teams = require("~/knex/models/Teams")

module.exports = {
    getTeam(userId, teamId) {
        const team = await Teams.query().select('*')
    }
}