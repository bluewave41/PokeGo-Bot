const CurrentEncounters = require('~/knex/models/CurrentEncounters');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const EncounterBuilder = require('~/data/Builders/EncounterBuilder');
const ItemListBuilder = require('~/data/Builders/ItemListBuilder');
const User = require('~/knex/models/User');
const EncounterCommands = require('~/data/ModelHandlers/EncounterCommands');
const CustomError = require('~/lib/errors/CustomError');
const Utils = require('~/lib/Utils');
const PlayerEncounters = require('../../knex/models/PlayerEncounters');
const Command = require('../Command');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const PokedexCommands = require('~/data/ModelHandlers/PokedexCommands');
const TypeList = require('~/data/Lists/TypeList');
const UserCommands = require('~/data/ModelHandlers/UserCommands');

const options = {
    names: [],
    expectedParameters: [
        { name: 'position', type: 'number', optional: false }
    ],
    nextCommand: 'encounter/SelectSquare',
    canQuit: true,
}

class StartEncounter extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const user = await User.query().select('level', 'itemstorage', 'secretId', 'location')
            .withGraphFetched('medals')
            .where('userId', this.msg.userId).first();

        const sprites = await EncounterCommands.getSprites(this.msg.userId, user.location, user.secretId);

        //make sure user is in an encounter
        if(!sprites) {
            throw new CustomError('NO_ENCOUNTER');
        }
        if(this.position > sprites.length) {
            throw new CustomError('INVALID_RANGE_CHOICE', sprites.length);
        }

        const encounter = sprites[this.position-1];

        if(encounter.type == 'pokestop') {
            const receivedItems = await spinPokestop(this.msg.userId, user.level, user.itemstorage, encounter);
            const embed = {
                title: 'Items',
                description: 'You received: \n' + ItemListBuilder.build(receivedItems),
            }
            await UserCommands.reset(this.msg.userId);
            await UserCommands.addXP(this.msg.userId, 100);
            return EmbedBuilder.build(this.msg, embed);
        }
        /*else if(encounter.type == 'rocket') {
            const top3 = await PokemonCommands.getTop3(userId);
            
            res.json(top3);
            return res.end();
        }*/
        else {
            let pokeBalls = await InventoryCommands.getPokeballs(this.msg.userId);
            if(!pokeBalls.length) {
                throw new CustomError('INSUFFICIENT_POKEBALLS');
            }
            //user has enough pokeballs so the encounter is valid

            //update the seen entry for pokedex
            await PokedexCommands.insert(this.msg.userId, encounter.pokedexId, false);
    
            //get the pokemon
            const pokemon = await CurrentEncounters.query().select('*')
                .where('encounterId', encounter.encounterId)
                .first();
    
            //if its level is higher than yours it needs to be set to something under your level
            if(pokemon.level > user.level) {
                pokemon.level = Utils.getRandomInt(1, user.level);
            }

            pokeBalls = pokeBalls.sort((a, b) => a.itemId - b.itemId);
        
            //add encounter data to the pokemon
            pokemon.userId = this.msg.userId;
            pokemon.candyEarned = pokemon.catchCandy;
            pokemon.activePokeball = pokeBalls[0].itemId;
            pokemon.medalMultiplier = calculateMedalMultiplier(pokemon, user.medals);
            pokemon.shiny = pokemon.shinyId == user.secretId;
            pokemon.cp = pokemon.calculateNewCP(pokemon.level);
            pokemon.hp = pokemon.calculateHP(pokemon.level);
            delete pokemon['shinyId'];
        
            //add the encounter data
            const insertedEncounter = await PlayerEncounters.query().insert(pokemon);
        
            //add active ball to inventory
            pokeBalls.find(el => el.itemId == insertedEncounter.activePokeball).active = true;
        
            const circleColor = insertedEncounter.catchChance;

            const data = {
                pokemon: insertedEncounter.pokemon,
                pokeBalls: pokeBalls,
                position: 1,
                catchChance: circleColor,
                type: 'pokemon'
            }

            super.run();
            const embed = EncounterBuilder.build(this.msg, data);
            return EmbedBuilder.build(this.msg, embed);
        }
    }
}

module.exports = {
    options: options,
    class: StartEncounter
}

async function spinPokestop(userId, level, storageLimit, pokestop) {
    const itemCount = await InventoryCommands.getTotalItemCount(userId);
    if(itemCount >= storageLimit) {
        throw new CustomError('ITEM_STORAGE_FULL');
    }

    const possibleItems = ItemList.getPokestopItems(level);
    let receivedItems = [];
    let amount = Math.floor(Math.random() * 3) + 3;
    for(var i=0;i<amount;i++) {
        let item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        receivedItems.push(item);
        await InventoryCommands.addItems(userId, item.id, 1);
    }

    await PokestopCommands.spin(userId, pokestop.id);

    return receivedItems;
}

function calculateMedalMultiplier(pokemon, medals) {
    const types = pokemon.types;
    const type1 = TypeList[types[0]];
    const type2 = TypeList[types[1]] || null;

    let type1Medal = medals.find(el => el.medalId == type1);
    let type2Medal;
    if(type1Medal) {
        type1Medal = type1Medal.multiplier;
    }
    else {
        type1Medal = 1;
    }
    if(type2) {
        type2Medal = medals.find(el => el.medalId == type2);
        if(type2Medal) {
            type2Medal = type2Medal.multiplier;
        }
        else {
            type2Medal = 1;
        }
    }

    let multiplier = 1;

    //calculate average
    if(type1Medal && type2Medal) {
        multiplier *= (type1Medal + type2Medal) / 2;
    }
    //pokemon only has 1 type
    else {
        multiplier *= type1Medal;
    }

    return multiplier;
}