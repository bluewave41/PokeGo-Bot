const Candy = require('~/knex/models/Candy');

module.exports = {
    async getCandyForPokemon(userId, candyId) {
        let candy = await Candy.query().select('amount')
        .where('userId', userId)
        .where('candyId', candyId);
        return candy.length ? candy[0].amount : false;
    },
    async insertCandy(userId, candyId, amount) {
        let row = await Candy.query().select('amount') //if user has 0 candy this breaks
        .where('userId', userId)
        .where('candyId', candyId);
        if(!row.length) {
            await Candy.query().insert({
                userId: userId,
                candyId: candyId,
                amount: amount 
            });
        }
        else {
            await Candy.query().increment('amount', amount)
            .where('userId', userId)
            .where('candyId', candyId);
        }
    },
    async removeCandy(userId, candyId, amount) {
        await Candy.query().decrement('amount', amount)
            .where('userId', userId)
            .where('candyId', candyId);
    }
}