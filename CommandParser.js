const ListCommand = require('./commands/ListCommand');
const NicknameCommand = require('./commands/NicknameCommand');
const DisplayCommand = require('./commands/DisplayCommand');
const FavoriteComand = require('./commands/FavoriteCommand');
const ShowMap = require('./commands/travel/ShowMap');
const SearchCommand = require('./commands/SearchCommand');
const ResetCommand = require('./commands/ResetCommand');
const InventoryCommand = require('./commands/InventoryCommand');
const ShopCommand = require('./commands/ShopCommand');
const PrefixCommand = require('./commands/PrefixCommand');
const CreateRedeemCodeCommand = require('./commands/owner/CreateRedeemCodeCommand');
const RedeemCommand = require('./RedeemCommand');
const EvolveCommand = require('./commands/EvolveCommand');
const InfoCommand = require('./commands/InfoCommand');
const QuitCommand = require('./commands/QuitCommand');
const DailyCommand = require('./commands/DailyCommand');
const UseCommand = require('./commands/UseCommand');
const TeamCommand = require('./commands/teams/TeamCommand');
const MedalCommand = require('./commands/MedalCommand');

const User = require('./knex/models/User');
const Server = require('./knex/models/Server');

const Colors = require('~/data/Lists/ColorList');
require('~/lib/Database');

async function parse(msg) {
	await init(msg);
	let content = msg.content.split(' ');
    let prefix = await getPrefix(msg);
    server = server.data;
    msg.prefix = server.prefix;
    msg.parameters = content; //doing this here as well for nextCommand functions to have

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
            case 'd':
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
            case 'teams':
                return TeamCommand(msg);
        }
    }
    else if(msg.nextCommand) {
        return require('./commands/' + msg.nextCommand)(msg);
    }
}

async function getPrefix(msg) {
    return (await Server.query().select('prefix')
        .where('serverId', msg.guild.id).first()).prefix;
}

async function init(msg) {
    //this one uses discordId so we can't use UserComamnds
    let user = await User.query().select('userId', 'nextCommand', 'location', 'lastMessageId', 'gotStarter', 'team')
        .where('discordID', msg.author.id).first();
    if(!user) {
        user = await User.query().insert({
            discordID: msg.author.id,
            username: msg.author.name,
            discriminator: msg.author.discriminator,
            currency: 500,
            stardust: 5000,
            secretId: Math.floor(Math.random() * 500) + 1,
        });
    };
    const info = {
        userId: user.userId,
        nextCommand: user.nextCommand,
        location: user.location,
        lastMessageId: user.lastMessageId,
        gotStarter: user.gotStarter,
        team: user.team,
        color: Colors[user.team],
    }
	Object.assign(msg, info);
}

function checkPrefix(content, prefix) {
	let givenPrefix = content.substr(0, prefix.length);
	return givenPrefix == prefix;
}

module.exports = {
	parse,
}