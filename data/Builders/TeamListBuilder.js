module.exports = {
    build(teams) {
        let description = 'You have no teams.';
        if(teams) {
            description = '';
            for(var i=0;i<teams.length;i++) {
                description += i+1 + '. ' + teams[i].name + '\n';
            }
        }
        return description;
    }
}