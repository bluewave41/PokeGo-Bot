const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const PokemonCommands = require('../data/ModelHandlers/PokemonCommands');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const Command = require('./Command');

const options = {
    names: ['transfer'],
    expectedParameters: [
        { name: 'pokemonId', type: 'number', optional: false }
    ],
    nextCommand: 'transfer/ConfirmTransfer',
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
        const object = { pokemonId: this.pokemonId };
        await UserCommands.update(this.msg.userId, [
            { rowName: 'saved', value: JSON.stringify(object) }
        ]);

        let embed = {
            title: 'Transfer',
            description: `Are you sure you wish to transfer ${this.pokemon.name}?`,
            image: this.pokemon.url,
            footer: 'Y or yes to confirm, anything else to cancel.'
        }
        
        super.run();
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: TransferCommand
}