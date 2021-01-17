module.exports = {
    build(team) {
        return [
            [team.p1 ? team.p1.name + ' - ' + team.p1.cp : '1',
             team.p1 ? team.p1.emoji : 'Empty',
             true],
            [team.p2 ? team.p2.name + ' - ' + team.p2.cp : '2',
             team.p2 ? team.p2.emoji : 'Empty',
             true],
            [team.p3 ? team.p3.name + ' - ' + team.p3.cp : '3',
             team.p3 ? team.p3.emoji : 'Empty',
             true],
        ];
    }
}