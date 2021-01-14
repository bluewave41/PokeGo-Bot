const SpunPokestops = require("~/knex/models/SpunPokestops")

module.exports = {
    async spin(userId, pokestopId) {
        await SpunPokestops.query().insert({
            userId: userId,
            pokestopId: pokestopId
        });
    }
}