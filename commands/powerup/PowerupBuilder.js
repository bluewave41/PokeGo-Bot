module.exports = {
    build: function(msg, data) {
        const pokemon = data.pokemon;

        let fields = [];
        fields.push(['Level', `${pokemon.level} => ${data.nextLevel}`, true]);
        fields.push(['CP', `${pokemon.cp} => ${data.newCP}`, true]);
        fields.push(['Cost', `${data.requiredCandy} candy`, true]);
    
        let description = `Input one of the following:\n`;
        description += `- The number of times you want to powerup (1-${data.howManyLevels})\n`;
        description += `- confirm to confirm your choice\n`;
        description += `- quit (or ${msg.prefix}quit) to exit out of this menu.\n`;

        const embed = {
            title: 'Powerup',
            description: description,
            image: pokemon.url,
            fields: fields,
            footer: `You have ${data.candy} candy. You'll have ${data.candy-data.requiredCandy} after this.`,
        }

        return embed;
    }
}