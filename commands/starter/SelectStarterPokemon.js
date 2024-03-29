const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Command = require('../Command');
const Starters = require('~/data/Lists/StartersList');
const CustomError = require('~/lib/errors/CustomError');
const PokemonBuilder = require('~/lib/PokemonBuilder');
const InventoryCommands = require('../../data/ModelHandlers/InventoryCommands');
const PokemonCommands = require('../../data/ModelHandlers/PokemonCommands');
const User = require('~/knex/models/User');

const options = {
    names: [],
    expectedParameters: [
        { name: 'pokemonName', type: ['string'], optional: false }
    ],
    info: 'Selecting a starter'
}

class SelectStarterPokemon extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const starter = Starters.find(el => el[2].toLowerCase() == this.pokemonName.toLowerCase());
        if(!starter) {
            throw new CustomError('INVALID_STARTER');
        }
        
        let pokemon = PokemonBuilder.generatePokemon(starter[0], 1, this.msg.userId);
        
        pokemon = await PokemonCommands.catchPokemon(this.msg.userId, pokemon, 3);
        await InventoryCommands.addItems(this.msg.userId, 1, 5);
        await User.query().update({
            gotStarter: true
        })
        .where('userId', this.msg.userId);
        
        let embed = {
            title: 'Starter',
            description: `Congratulations! You obtained a level ${pokemon.level} ${pokemon.name}!\nID: \`${pokemon.pokemonId}\``,
            image: pokemon.url
        }

        await User.reset(this.msg.userId);

        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: SelectStarterPokemon
}