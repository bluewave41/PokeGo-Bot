const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Emojis = require('~/data/Lists/EmojiList');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const PokemonCommands = require('../data/ModelHandlers/PokemonCommands');
const InventoryCommands = require('../data/ModelHandlers/InventoryCommands');
const LevelList = require('~/data/Lists/LevelList');
const Command = require('./Command');

const options = {
    names: ['info'],
    expectedParameters: [],
    global: true,
}

class InfoCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const infoParameters = ['xp', 'level', 'currency', 'totalxp', 'stardust', 'storage', 'itemstorage', 'location'];
        const user = await UserCommands.getFields(this.msg.userId, infoParameters);

        const pokemonCount = await PokemonCommands.getPokemonCount(this.msg.userId);
        const itemCount = await InventoryCommands.getTotalItemCount(this.msg.userId);
        const requiredXP = LevelList[user.level].requiredXP;

        let status = 'Nothing right now';

        if(this.msg.nextCommand) {
            const command = require(`./${this.msg.nextCommand}`);
            status = command.options.info;
        }

        const embed = {
            title: this.msg.author.username + "'s Info",
            description: '',
            thumbnail: process.env.sprites + `/teams/${this.msg.team}.png`,
            fields: [
                ['Currency', user.currency + ' ' + Emojis.COIN, true],
                ['Stardust', user.stardust + Emojis.STARDUST, true],
                ['Location', user.location.toUpperCase(), false],
                ['Pokemon Storage', pokemonCount + '/' + user.storage, true],
                ['Item Storage',  itemCount + '/' + user.itemstorage, true],
                ['Player Progress', `Level: ${user.level}\nXP: ${user.xp}/${requiredXP}\n${user.totalxp} total XP`],
                ['Current Status', status, false],
            ]
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: InfoCommand
}