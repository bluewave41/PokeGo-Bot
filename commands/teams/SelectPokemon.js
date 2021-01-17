const Command = require("../Command");
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Pokemon = require('~/knex/models/Pokemon');
const PokemonListBuilder = require('~/data/Builders/PokemonListBuilder');
const Teams = require('~/knex/models/Teams');
const TeamBuilder = require('~/data/Builders/TeamBuilder');

const options = {
    names: [],
    expectedParameters: [
        { name: 'pokemonId', type: 'number', optional: false }
    ]
}

class SelectPokemon extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const saved = await UserCommands.getSaved(this.msg.userId);
        const field = 'pokemon' + saved.slot;
        await Teams.query().update({
            [field]: this.pokemonId
        })
        .where('userId', this.msg.userId);

        const team = await Teams.query().select('*')
            .withGraphFetched('p1')
            .withGraphFetched('p2')
            .withGraphFetched('p3')
            .where('userId', this.msg.userId)
            .where('teamId', saved.teamId)
            .first();

        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'teams/SelectSlot' }
        ]);

        const embed = {
            title: team.name,
            description: 'Select a slot',
            fields: TeamBuilder.build(team)
        }
        return EmbedBuilder.edit(this.msg, embed);
    }
    async handleReactionAdd(reaction, msg) {
        const validEmojis = ['⬅️', '➡️'];
        if(!validEmojis.includes(reaction.emoji.name)) {
            return;
        }
        const saved = await UserCommands.getSaved(msg.userId);
        switch(reaction.emoji.name) {
            case '⬅️':
                if(saved.page-1 >= 0) {
                    saved.page--;
                }
                break;
            case '➡️':
                if(saved.page+1 < saved.maxPage) {
                    saved.page++;
                }
        }

        const pokemon = await Pokemon.query().select('*')
            .orderBy('cp', 'DESC')
            .offset(saved.page*25)
            .limit(25)
            .where('ownerId', msg.userId).debug();

        const embed = {
            title: 'List',
            description: PokemonListBuilder.build(pokemon),
            footer: `Page ${saved.page+1} of ${Math.ceil(saved.count/25)} - ${saved.count} results.`,
        }

        await reaction.users.remove(msg.author.id);

        return EmbedBuilder.edit(msg, embed);
    }
}

module.exports = {
    options: options,
    class: SelectPokemon,
}