const Emojis = require('~/data/Lists/EmojiList');

module.exports = {
    build(msg, encounter) {
        console.log(encounter);
        console.log(encounter.emoji);
        let description = `Level ${encounter.pokemon.level} ${encounter.pokemon.displayName}\nCP: ${encounter.pokemon.cp} `;
        if(encounter.catchChance >= .80) {
            description += Emojis['GREEN_CIRCLE'] + '\n';
        }
        else if(encounter.catchChance >= .50) {
            description += Emojis['YELLOW_GREEN_CIRCLE'] + '\n';
        }
        else if(encounter.catchChance >= .40) {
            description += Emojis['YELLOW_CIRCLE'] + '\n';
        }
        else if(encounter.catchChance >= .20) {
            description += Emojis['ORANGE_CIRCLE'] + '\n';
        }
        else {
            description += Emojis['RED_CIRCLE'] + '\n';
        }
        let field = ['<:grass:788077293503119400>', '<:grass:788077293503119400>', '<:grass:788077293503119400>'];
        field[encounter.position] = encounter.pokemon.emoji;

        let embed = {
            title: 'Encounter',
        }

        const totalBalls = encounter.pokeBalls.reduce((acc, { amount }) => acc + amount, 0);

        if(encounter.flag) {
            switch(encounter.flag) {
                case 'caught':
                    description += `Wow! You caught ${encounter.pokemon.name}!\nView it with ${msg.prefix}d ${encounter.pokemonId}`;
                    embed.image = encounter.pokemon.url;
                    embed.footer = `You gained ${encounter.xpGained} XP, ${encounter.catchDust} stardust and received ${encounter.catchCandy} candy.`;
                break;
                case 'fail':
                    description += `Oh no! The Pokemon broke free!\n`;
                    if(totalBalls <= 0) {
                        description += `You're out of Poke balls. The Pokemon got away!\n`;
                    }
                break;
                case 'missed':
                    description += `You threw a ball but you missed!\n`;
                    if(totalBalls <= 0) {
                        description += `You're out of Poke balls. The Pokemon got away!\n`;
                    }
                break;
            }
        }

        if(totalBalls > 0 && encounter.flag != 'caught') {
            for(var i=0;i<encounter.pokeBalls.length;i++) {
                if(encounter.pokeBalls[i].active) {
                    description += '\\> ';
                }
                description += encounter.pokeBalls[i].emoji + ' - ' + encounter.pokeBalls[i].amount + '\n';
            }

            if(encounter.item) {
                description += `Active item: ${encounter.item.emoji}\n\n`;
            }
            else {
                description += '\n';
            }

            if(encounter.position != -1) { //don't add this if the Pokemon was caught
                description += field.join('');
            }
        }
        
        embed.description = description;

        return embed;
    }
}