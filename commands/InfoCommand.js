const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Emojis = require('~/data/Lists/EmojiList');
const PokemonCommands = require('../data/ModelHandlers/PokemonCommands');
const InventoryCommands = require('../data/ModelHandlers/InventoryCommands');
const LevelList = require('~/data/Lists/LevelList');
const Command = require('./Command');
const User = require('~/knex/models/User');

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
        const user = await User.query().select('xp', 'level', 'currency', 'totalxp', 'stardust', 'storage', 'itemstorage', 'location')
            .where('userId', this.msg.userId)
            .first();

        const pokemonCount = await PokemonCommands.getPokemonCount(this.msg.userId);
        const itemCount = await InventoryCommands.getTotalItemCount(this.msg.userId);

        let status = 'Nothing right now';
        let levelProgressString = `Level: ${user.level}`;
        if(LevelList[user.level]) {
            levelProgressString += `\nXP: ${user.xp}/${LevelList[user.level].requiredXP}`;
        }
        levelProgressString += `\n${user.totalxp} total XP`;

        if(this.msg.nextCommand) {
            const command = require(`./${this.msg.nextCommand}`);
            status = command.options.info;
        }

        const embed = {
            title: this.msg.author.username + "'s Info",
            description: '',
            thumbnail: process.env.url + `sprites/misc/${this.msg.team}.png`,
            fields: [
                ['Currency', user.currency + ' ' + Emojis.COIN, true],
                ['Stardust', user.stardust + Emojis.STARDUST, true],
                ['Location', user.location.toUpperCase(), false],
                ['Pokemon Storage', pokemonCount + '/' + user.storage, true],
                ['Item Storage',  itemCount + '/' + user.itemstorage, true],
                ['Player Progress', levelProgressString, false],
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