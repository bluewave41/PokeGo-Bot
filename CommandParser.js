const axios = require('axios');
const ShowStarters = require('./commands/starter/ShowStarters');
const ListCommand = require('./commands/ListCommand');
const NicknameCommand = require('./commands/NicknameCommand');
const DisplayCommand = require('./commands/DisplayCommand');
const FavoriteComand = require('./commands/FavoriteCommand');
const ShowMap = require('./commands/travel/ShowMap');
const SearchCommand = require('./commands/SearchCommand');
const ResetCommand = require('./commands/ResetCommand');
const InventoryCommand = require('./commands/InventoryCommand');
const TransferCommand = require('./commands/transfer/SelectPokemon');
const GivePokemonCommand = require('./commands/debug/GivePokemonCommand');
const PowerupCommand = require('./commands/powerup/PowerupCommand');
const ShopCommand = require('./commands/ShopCommand');
const PrefixCommand = require('./commands/PrefixCommand');
const CreateRedeemCodeCommand = require('./commands/owner/CreateRedeemCodeCommand');
const RedeemCommand = require('./RedeemCommand');
const EvolveCommand = require('./commands/EvolveCommand');
const SQLCommand = require('./commands/owner/SQLCommand');
const InfoCommand = require('./commands/InfoCommand');
const MailCommand = require('./commands/mail/MailCommand');
const QuitCommand = require('./commands/QuitCommand');
const ViewNews = require('./commands/news/ViewNews');
const DailyCommand = require('./commands/DailyCommand');
const PokedexCommand = require('./commands/pokedex/PokedexCommand');
const UseCommand = require('./commands/UseCommand');
const TeamCommand = require('./commands/team/TeamCommand');
const MedalCommand = require('./commands/MedalCommand');

async function parse(msg) {
	await init(msg);
	let content = msg.content.split(' ');
    let server = await axios.post(process.env.url + 'server/getServer', {serverId: msg.guild.id});
    server = server.data;
    msg.prefix = server.prefix;

    const prefixCheck = checkPrefix(content[0], server.prefix);
    let command;

    if(prefixCheck) {
        command = content[0].substring(server.prefix.length, content[0].length);
        content.shift();
        msg.parameters = content;

        /*Commands that can be run regardless of stater*/
        switch(command) {
            case 'prefix':
                return PrefixCommand(msg);
            //debug
             case 'givePokemon':
                return GivePokemonCommand(msg);
            case 'createRedeemCode':
                return CreateRedeemCodeCommand(msg);
               case 'sql':
                return SQLCommand(msg);
        }

        if(!msg.gotStarter && command != 'starter') { //user doesn't have a starter and tried a command
            return `You don't have a starter Pokemon! Get one with ${server.prefix}starter`;
        }
        
        //check for global commands here
        /*GLOBAL COMMANDS CAN'T ALTER NEXT COMMAND*/
        switch(command) {
            case 'info':
                return InfoCommand(msg);
            case 'reset':
                return ResetCommand(msg);
             case 'quit':
                return QuitCommand(msg);
            case 'daily':
                return DailyCommand(msg);
            case 'use':
                return UseCommand(msg);
        }

        if(msg.nextCommand) {
            return require('./commands/' + msg.nextCommand)(msg);
        }

        switch(command) {
            case 'starter':
                return ShowStarters(msg);
            case 'list':
                return ListCommand(msg);
            case 'nickname':
                return NicknameCommand(msg);
            case 'display':
                return DisplayCommand(msg);
            case 'favorite':
                return FavoriteComand(msg);
            case 'travel':
                return ShowMap(msg);
            case 'search':
                return SearchCommand(msg);
            case 'inventory':
            case 'inv':
                return InventoryCommand(msg);
            case 'transfer':
                return TransferCommand(msg);
            case 'powerup':
                return PowerupCommand(msg);
            case 'shop':
                return ShopCommand(msg);s
            case 'redeem':
                return RedeemCommand(msg);
            case 'evolve':
                return EvolveCommand(msg);
            case 'mail':
                return MailCommand(msg);
            case 'news':
                return ViewNews(msg);
            case 'pokedex':
                return PokedexCommand(msg);
            case 'team':
                return TeamCommand(msg);
            case 'medals':
                return MedalCommand(msg);
        }
    }
    else if(msg.nextCommand) {
        return require('./commands/' + msg.nextCommand)(msg);
    }
}

async function init(msg) {
	let response = await axios.post(process.env.url + 'user/init', {discordID: msg.author.id, username: msg.author.username, discriminator: msg.author.discriminator});
	Object.assign(msg, response.data);
}

function checkPrefix(content, prefix) {
	let givenPrefix = content.substr(0, prefix.length);
	return givenPrefix == prefix;
}

module.exports = {
	parse,
}