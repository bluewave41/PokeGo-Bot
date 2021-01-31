module.exports = {
    build(team) {
        let fields = [
            ['1', 'Empty', true],
            ['2', 'Empty', true],
            ['3', 'Empty', true]
        ];
        for(var i=0;i<team.pokemon.length;i++) {
            const pokemon = team.pokemon[i];
            const emoji = pokemon.hp == 0 ? pokemon.emoji + ':x:' : pokemon.emoji;
            fields[pokemon.slot-1] = [pokemon.displayName + ' - CP: ' + pokemon.cp, emoji, true];
        }
        return fields;
    }
}