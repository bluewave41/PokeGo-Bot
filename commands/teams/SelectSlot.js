const Pokemon = require('~/knex/models/Pokemon');
const PokemonListBuilder = require('~/data/Builders/PokemonListBuilder');
const Command = require('../Command');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const User = require('~/knex/models/User');

const options = {
    names: [],
    expectedParameters: [
        { name: 'slot', type: 'number', optional: false }
    ],
    canQuit: true,
    info: 'Selecting a team slot to edit'
}

class SelectSlot extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        let saved = await User.getJSON(this.msg.userId);

        saved = { teamId: saved.teamId, slot: this.slot, page: 0 }

        const pokemon = await Pokemon.query().select('*')
            .offset(saved.page*25)
            .orderBy('cp', 'DESC')
            .limit(25)
            .where('ownerId', this.msg.userId);

        let count = await Pokemon.query().count('* as pokemonCount')
            .where('ownerId', this.msg.userId)
            .first();

        saved.count = count.pokemonCount;
        saved.maxPage = Math.ceil(count.pokemonCount/25);

        await User.query().update({
            nextCommand: 'teams/SelectPokemon',
            saved: JSON.stringify(saved)
        })
        .where('userId', this.msg.userId);


        const embed = {
            title: 'List',
            description: PokemonListBuilder.build(pokemon),
            footer: `Page ${saved.page+1} of ${Math.ceil(count.pokemonCount/25)} - ${count.pokemonCount} results.`,
        }

        return EmbedBuilder.edit(this.msg, embed);
    }
    async afterSend(lastMessageId) {
        const message = await this.msg.channel.messages.fetch(lastMessageId);
        await message.react('⬅️');
        await message.react('➡️');
    }
}

module.exports = {
    options: options,
    class: SelectSlot,
}