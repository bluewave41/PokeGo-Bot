const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PokemonCommands = require('../data/ModelHandlers/PokemonCommands');
const Command = require('./Command');
const User = require('~/knex/models/User');

const options = {
    names: ['transfer'],
    expectedParameters: [
        { name: 'pokemonId', type: ['number'], optional: false }
    ],
}

class TransferCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, this.pokemonId);
        await PokemonCommands.canTransferPokemon(this.msg.userId, this.pokemonId);
    }
    async run() {
        await User.query().update({
            nextCommand: 'transfer/ConfirmTransfer',
            saved: JSON.stringify({ pokemonId: this.pokemonId })
        })
        .where('userId', this.msg.userId);

        let embed = {
            title: 'Transfer',
            description: `Are you sure you wish to transfer ${this.pokemon.name}?`,
            image: this.pokemon.url,
            footer: 'Y or yes to confirm, anything else to cancel.'
        }
        
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: TransferCommand
}