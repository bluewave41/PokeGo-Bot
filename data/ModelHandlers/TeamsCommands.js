const Teams = require("~/knex/models/Teams")

module.exports = {
    async getValidBattleTeams(userId) {
        let teams = await Teams.query().select('*')
            .withGraphFetched('pokemon')
            .where('player_teams.userId', userId);

        teams = teams.filter(function(team) {
            if(team.pokemon.length != 3) {
                return false;
            }
            for(var i=0;i<team.pokemon.length;i++) {
                if(team.pokemon[i].hp <= 0) {
                    return false;
                }
            }
            return true;
        })

        return teams;
    }
}