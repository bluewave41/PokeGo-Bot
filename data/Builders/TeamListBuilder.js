module.exports = {
    build(teams, showInvalid=true) {
        let description = 'You have no teams.';
        console.log('TEAMS', teams);
        if(!showInvalid) {
            //remove any team that doesn't have 3 Pokemon or that has a fainted Pokemon on it
            teams = teams.filter(function(team) {
                if(team.pokemon.length != 3) {
                    return false;
                }
                for(var i=0;i<team.pokemon.length;i++) {
                    if(team.pokemon[i].hp <= 0) {
                        return false;
                    }
                }
                return true;
            })
            console.log('TEAMS', teams);
        }
        if(teams.length) {
            description = '';
            for(var i=0;i<teams.length;i++) {
                let team = teams[i];
                let pokemonDisplay = [':x:', ':x:', ':x:'];
                console.log(team);
                description += i+1 + '. ' + team.name + ' ';
                for(var j=0;j<team.pokemon.length;j++) {
                    let pokemon = team.pokemon[j];
                    pokemonDisplay[pokemon.slot-1] = pokemon.emoji; 
                }
                description += pokemonDisplay.join(' ') + '\n';
            }
        }
        return description;
    }
}