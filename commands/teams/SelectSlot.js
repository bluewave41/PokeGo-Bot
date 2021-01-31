const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Pokemon = require('~/knex/models/Pokemon');
const PokemonListBuilder = require('~/data/Builders/PokemonListBuilder');
const Command = require('../Command');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

const options = {
    names: [],
    expectedParameters: [
        { name: 'slot', type: 'number', optional: false }
    ],
    canQuit: true,
}

class SelectSlot extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const { teamId } = await UserCommands.getSaved(this.msg.userId)

        const saved = { teamId: teamId, slot: this.slot, page: 0 }

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
        
        await UserCommands.update(this.msg.userId, [
            { rowName: 'nextCommand', value: 'teams/SelectPokemon' },
            { rowName: 'saved', value: JSON.stringify(saved) }
        ]);

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