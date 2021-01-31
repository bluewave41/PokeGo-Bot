const BattleEmbedBuilder = require('~/data/Builders/BattleEmbedBuilder');

module.exports = {
    async show(msg, parameters) {
        const pokemon1 = parameters.pokemon1;
        const pokemon2 = parameters.pokemon2;
        const embed = {
            title: 'Incoming Charge Attack!',
            description: `${pokemon2.name} is about to attack! Use a shield?`,
        }
        return BattleEmbedBuilder.edit(msg, pokemon1, pokemon2, embed);
    }
}