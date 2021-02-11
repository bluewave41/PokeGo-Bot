module.exports = {
    build(pokemonList, type) {
        if(!pokemonList.length) {
            return `You have no Pokemon to ${type}.`;
        }
        let description = '';
        for(var i=0;i<pokemonList.length;i++) {
            let pokemon = pokemonList[i];
            description += `${pokemon.emoji} | ${pokemon.displayName} | CP: ${pokemon.cp} | \`${pokemon.pokemonId}\` | HP: ${pokemon.hp}/${pokemon.maxHP}\n`;
        }
        return description;
    },
}