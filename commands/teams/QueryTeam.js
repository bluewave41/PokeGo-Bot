const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Teams = require('~/knex/models/Teams');
const Command = require('../Command');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const TeamBuilder = require('~/data/Builders/TeamBuilder');

//create name
//delete name
//edit name
//integer to select team or select name?

const options = {
    names: [],
    expectedParameters: [
        { name: 'action', type: 'string', optional: false },
        { name: 'name', type: 'string', optional: false, sanitize: true, }
    ]
}

class QueryTeam extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        let team, saved, embed;
        switch(this.action) {
            case 'create':
                let { highest } = await Teams.query().max('teamId as highest')
                    .where('userId', this.msg.userId);
        
                if(!highest) {
                    highest = 0;
                }
        
                team = await Teams.query().insert({
                    userId: this.msg.userId,
                    teamId: highest+1,
                    name: this.name
                });

                saved = { teamId: team.teamId }
        
                await UserCommands.update(this.msg.userId, [
                    { rowName: 'nextCommand', value: 'teams/SelectSlot' },
                    { rowName: 'saved', value: JSON.stringify(saved) }
                ]);

                //this was just created so we don't need TeamBuilder here as it's empty
                embed = {
                    title: this.name,
                    description: 'Select a slot',
                    fields: [['1', 'Empty', true], ['2', 'Empty', true], ['3', 'Empty', true]]
                }
                return EmbedBuilder.edit(this.msg, embed);
            case 'select':
                team = await Teams.query().select('*')
                    .withGraphFetched('p1')
                    .withGraphFetched('p2')
                    .withGraphFetched('p3')
                    .where('userId', this.msg.userId)
                    .where('name', this.name)
                    .first();
                console.log(team)
    
                saved = { teamId: team.teamId }
            
                await UserCommands.update(this.msg.userId, [
                    { rowName: 'nextCommand', value: 'teams/SelectSlot' },
                    { rowName: 'saved', value: JSON.stringify(saved) }
                ]);
    
                embed = {
                    title: this.name,
                    description: 'Select a slot',
                    fields: TeamBuilder.build(team)
                }
                return EmbedBuilder.edit(this.msg, embed);
        }
    }
}

module.exports = {
    options: options,
    class: QueryTeam,
}