module.exports = {
    build(pokemonList) {
        let description = '';
        if(!pokemonList.length) {
            return "No Pokemon exist in that search.";
        }
        for(var i=0;i<pokemonList.length;i++) {
            let pokemon = pokemonList[i];
            description += `${pokemon.emoji} | ${pokemon.displayName} | CP: ${pokemon.cp} | \`${pokemon.pokemonId}\` | IV: ${pokemon.totalIV}%\n`;
        }
        return description;
    },
}