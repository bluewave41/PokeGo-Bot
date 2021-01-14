const { UniqueViolationError } = require("objection");
const Medals = require("~/knex/models/Medals");
const MedalList = require("~/data/Lists/MedalList");
const Types = require("~/data/Lists/TypeList")

module.exports = {
    async insertBadge(userId, pokemonTypes) {
        const medalId1 = Types[pokemonTypes[0]];
        const medalId2 = Types[pokemonTypes[1]] || null;

        try {
            await Medals.query().insert({
                userId: userId,
                medalId: medalId1,
                amount: 1,
            })
        }
        catch(err) {
            if(err instanceof UniqueViolationError) {
                await Medals.query().increment('amount', 1)
                    .where('userId', userId)
                    .where('medalId', medalId1)
            }
        }

        if(medalId2) {
            try {
                await Medals.query().insert({
                    userId: userId,
                    medalId: medalId2,
                    amount: 1,
                })
            }
            catch(err) {
                if(err instanceof UniqueViolationError) {
                    await Medals.query().increment('amount', 1)
                        .where('userId', userId)
                        .where('medalId', medalId2)
                }
            }
        }
    },
    async getMedals(userId) {
        const medals = await Medals.query().select('medalId', 'amount')
            .where('userId', userId);
        const allMedals = MedalList.slice(0);
        const medalsToReturn = [];
        for(var i=0;i<allMedals.length;i++) {
            let medal = allMedals[i];
            let playerMedalProgress = medals.find(el => el.medalId == allMedals[i].id);
            let target = medal.bronze;
            let tier = 'NONE';
            let amount = 0;
            if(playerMedalProgress) {
                amount = playerMedalProgress.amount;
                if(amount >= medal.platinum) {
                    tier = 'PLATINUM';
                }
                else if(amount >= medal.gold) {
                    tier = 'GOLD';
                    target = medal.platinum;
                }
                else if(amount >= medal.silver) {
                    tier = 'SILVER';
                    target = medal.gold;
                }
                else if(amount >= medal.bronze) {
                    tier = 'BRONZE';
                    target = medal.silver;
                }
                else {
                    tier = 'NONE';
                    target = medal.bronze;
                }
            }
            medalsToReturn.push({ name: medal.name, description: medal.description, target: target, tier: tier, amount: amount });
        }
        return medalsToReturn;
    }
}