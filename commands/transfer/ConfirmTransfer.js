const UserCommands = require('~/data/ModelHandlers/UserCommands');
const PokemonCommands = require('~/data/ModelHandlers/PokemonCommands');
const Command = require('../Command');
const CustomError = require('~/lib/errors/CustomError');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');

const options = {
    names: [],
    expectedParameters: [
        { name: 'confirm', type: 'string', optional: false }
    ],
    reset: true,
}

class ConfirmTransfer extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        isConfirmation(this.confirm);
    }
    async run() {
        const saved = await UserCommands.getSaved(this.msg.userId);
        const pokemonId = saved.pokemonId;
        let pokemon = await PokemonCommands.getStrictPokemon(this.msg.userId, pokemonId);
        pokemon = await PokemonCommands.transferPokemon(this.msg.userId, pokemon.pokemonId);

        const embed = {
            title: 'Transfer',
            description: `You transfered ${pokemon.name}. You received:\n- 1 candy`,
            image: pokemon.url
        }

        super.run();
        return EmbedBuilder.build(this.msg, embed);
    }
}

function isConfirmation(message) {
    switch(message.toLowerCase()) {
        case 'yes':
        case 'y':
        case 'confirm':
            return true;
    }
    throw new CustomError('INVALID_TRANSFER_CHOICE');
}

module.exports = {
    options: options,
    class: ConfirmTransfer,
}