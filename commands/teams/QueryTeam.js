const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Teams = require('~/knex/models/Teams');
const Command = require('../Command');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const TeamBuilder = require('~/data/Builders/TeamBuilder');
const CustomError = require('~/lib/errors/CustomError');
const TeamListBuilder = require('~/data/Builders/TeamListBuilder');

//create name - done
//delete name - done
//select (integer?) name - 

const options = {
    names: [],
    expectedParameters: [
        { name: 'action', type: 'string', possible: ['create', 'delete', 'select'], optional: false },
        { name: 'name', type: 'string', optional: false, sanitize: true, }
    ],
    canQuit: true,
    info: 'Viewing teams'
}

class QueryTeam extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        if(this.action == 'create') {
            const regex = /^[a-zA-Z0-9 ]+$/;
            if(!regex.test(this.name)) {
                throw new CustomError('INVALID_NAME');
            }
            if(this.name.length > 20) {
                throw new CustomError('INVALID_NAME_LENGTH');
            }
            const teamCount = await Teams.query().count('* as count')
                .where('userId', this.msg.userId)
                .first();

            if(teamCount.count >= 20) {
                throw new CustomError('TOO_MANY_TEAMS');
            }

            const team = await Teams.query().select('name')
                .where('userId', this.msg.userId)
                .where('name', this.name)
                .first();

            //check for duplicate team
            if(team) {
                throw new CustomError('TEAM_NAME_TAKEN');
            }
        }
    }
    async run() {
        let team, saved, embed;
        switch(this.action) {
            case 'create':
                let { highest } = await Teams.query().max('teamId as highest')
                    .where('userId', this.msg.userId)
                    .first();
        
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
                    .withGraphFetched('pokemon')
                    .where('userId', this.msg.userId)
                    .where('name', this.name)
                    .first();
    
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
            case 'delete':
                await Teams.query().delete()
                    .where('userId', this.msg.userId)
                    .where('name', this.name);
                
                const teams = await Teams.query().select('*')
                    .where('userId', this.msg.userId);

                embed = {
                    title: 'Teams',
                    description: TeamListBuilder.build(teams),
                    footer: `Create a team with create teamname`,
                }
                return EmbedBuilder.edit(this.msg, embed);
        }
    }
}

module.exports = {
    options: options,
    class: QueryTeam,
}