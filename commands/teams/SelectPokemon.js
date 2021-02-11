const Command = require("../Command");
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Pokemon = require('~/knex/models/Pokemon');
const User = require('~/knex/models/User');
const PokemonListBuilder = require('~/data/Builders/PokemonListBuilder');
const Teams = require('~/knex/models/Teams');
const TeamBuilder = require('~/data/Builders/TeamBuilder');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const TeamListings = require('~/knex/models/TeamListings');

const options = {
    names: [],
    expectedParameters: [
        { name: 'pokemonId', type: 'number', optional: false }
    ],
    canQuit: true,
    info: 'Selecting a Pokemon to add to their team'
}

class SelectPokemon extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
    }
    async run() {
        const saved = await User.getJSON(this.msg.userId);

        let team = await Teams.query().select('*')
            .withGraphFetched('pokemon')
            .where('userId', this.msg.userId)
            .where('teamId', saved.teamId)
            .first();

        //is the Pokemon already in our team?
        if(team.pokemon.find(el => el.pokemonId == this.pokemonId)) {
            await TeamListings.query().delete()
                .where('userId', this.msg.userId)
                .where('teamId', saved.teamId)
                .where('pokemonId', this.pokemonId);
        }

        const update = await TeamListings.query().update({
            pokemonId: this.pokemonId
        })
        .where('teamId', saved.teamId)
        .where('slot', saved.slot);

        if(!update) {
            await TeamListings.query().insert({
                userId: this.msg.userId,
                teamId: saved.teamId,
                pokemonId: this.pokemonId,
                slot: saved.slot,
            });
        }

        team = await Teams.query().select('*')
            .withGraphFetched('pokemon')
            .where('userId', this.msg.userId)
            .where('teamId', saved.teamId)
            .first();

        await User.setNextCommand(this.msg.userId, 'teams/SelectSlot');

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
        const saved = await User.getJSON(this.msg.userId);
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
            .where('ownerId', msg.userId);

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