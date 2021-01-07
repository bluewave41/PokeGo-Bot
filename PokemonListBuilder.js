module.exports = {
    build(pokemonList) {
        let description = '';
        if(!pokemonList.length) {
            return "No Pokemon exist in that search.";
        }
        for(var i=0;i<pokemonList.length;i++) {
            let pokemon = pokemonList[i];
            pokemon.name = this.flagParser(pokemon);
            description += `${pokemon.emoji} | ${pokemon.name} | CP: ${pokemon.cp} | \`${pokemon.pokemonId}\` | IV: ${pokemon.totalIV}%\n`;
        }
        return description;
    },
    flagParser(pokemon) {
        if(pokemon.favorite) {
            pokemon.name += ':star:';
        }
        if(pokemon.shiny) {
            pokemon.name += ':sparkles:';
        }
        return pokemon.name;
    }
}