const CurrentEncounters = require('~/knex/models/CurrentEncounters');
const SeenEncounters = require('~/knex/models/SeenEncounters');
const User = require('~/knex/models/User');
const SpunPokestops = require('~/knex/models/SpunPokestops');
const PlayerEncounters = require('~/knex/models/PlayerEncounters');
const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const EncounterBuilder = require('~/data/Builders/EncounterBuilder');
const SpriteListBuilder = require('~/data/Builders/SpriteListBuilder');
const ItemListBuilder = require('~/data/Builders/ItemListBuilder');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const EncounterCommands = require('~/data/ModelHandlers/EncounterCommands');
const PokedexCommands = require('~/data/ModelHandlers/PokedexCommands');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const TeamsCommands = require('~/data/ModelHandlers/TeamsCommands');
const CustomError = require('~/lib/errors/CustomError');
const Utils = require('~/lib/Utils');
const ItemHandler = require('~/lib/ItemHandler');
const Command = require('../Command');
const TypeList = require('~/data/Lists/TypeList');
const RocketTable = require('../battle/RocketTable');
const SelectTeamMenu = require('~/menus/SelectTeamMenu');
const { add } = require('date-fns');

const options = {
    names: [],
    expectedParameters: [
        { name: 'position', type: 'number', optional: false }
    ],
    canQuit: true,
    info: 'Selecting an encounter'
}

class StartEncounter extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const user = await User.query().select('level', 'itemstorage', 'secretId', 'location', 'level')
            .withGraphFetched('medals')
            .where('userId', this.msg.userId)
            .first();

        let sprites = await EncounterCommands.getSprites(this.msg.userId, user.location, user.secretId, user.level);

        //make sure user is in an encounter
        if(!sprites) {
            throw new CustomError('NO_ENCOUNTER');
        }
        if(this.position > sprites.length) {
            throw new CustomError('INVALID_RANGE_CHOICE', sprites.length);
        }

        const encounter = sprites[this.position-1];

        if(encounter.encounterType == 'pokestop') {
            const receivedItems = await spinPokestop(this.msg.userId, user.level, user.itemstorage, encounter);

            //update the sprites since we spun a poke stop
            sprites = await EncounterCommands.getSprites(this.msg.userId, user.location, user.secretId, user.level);

            let description = 'You received: \n' + ItemListBuilder.build(receivedItems) + '\n\n' + SpriteListBuilder.build(sprites);

            let embed = {
                title: 'Pokemon in the area',
                description: description
            }
    
            await UserCommands.addXP(this.msg.userId, 100);
        
            return EmbedBuilder.build(this.msg, embed);
        }
        else if(encounter.encounterType == 'rocket') {
            //user can only battle a rocket if they have a valid team
            const teams = await TeamsCommands.getValidBattleTeams(this.msg.userId);
            if(!teams.length) {
                throw new CustomError('NO_TEAMS');
            }

            const rocket = RocketTable.find(el => el.type == encounter.type);

            await User.query().update({
                nextCommand: 'battle/StartBattle',
                saved: JSON.stringify({ type: rocket.type, rocketId: encounter.rocketId })
            })
            .where('userId', this.msg.userId);

            this.menu = {
                class: SelectTeamMenu,
                parameters: {
                    rocketText: rocket.message,
                    showInvalid: false,
                }
            }
            return;
        }
        else {
            //this is a Pokemon encounter
            let pokeBalls = await InventoryCommands.getPokeballs(this.msg.userId);
            if(!pokeBalls.length) {
                throw new CustomError('INSUFFICIENT_POKEBALLS');
            }
            //user has enough pokeballs so the encounter is valid

            //update the seen entry for pokedex if this is first time user has chosen encounter
            const entry = await SeenEncounters.query().select('encounterId')
                .findOne('userId', this.msg.userId);

            if(!entry) {
                await PokedexCommands.insert(this.msg.userId, encounter.pokedexId, false);
                await SeenEncounters.query().insert({
                    userId: this.msg.userId,
                    encounterId: encounter.encounterId
                });
            }
    
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

            await User.setNextCommand(this.msg.userId, 'encounter/SelectSquare');

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
    let items;
    if(itemCount >= storageLimit) {
        throw new CustomError('ITEM_STORAGE_FULL');
    }

    if(pokestop.type == 0) {
        items = ItemHandler.getPokestopItems(level);
    }
    else if(pokestop.type == 1) {
        items = ItemHandler.getGymItems(level);
    }

    for(var i=0;i<items.length;i++) {
        await InventoryCommands.addItems(userId, items[i].id, 1);
    }

    const endTime = add(Date.now(), { minutes: 5 });

    await SpunPokestops.query().insert({
        userId: userId,
        pokestopId: pokestop.id,
        endtime: endTime
    });

    return items;
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