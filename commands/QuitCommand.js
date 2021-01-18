const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const CustomError = require('~/lib/errors/CustomError');
const Powerups = require('~/knex/models/Powerups');
const Command = require('./Command');
const PlayerEncounters = require('../knex/models/PlayerEncounters');

const options = {
    names: ['quit'],
    expectedParameters: [],
    global: true,
}

class QuitCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        isQuittable(this.msg.nextCommand);
    }
    async run() {
        switch(this.msg.nextCommand) {
            case 'powerup/PowerupResponse':
                await Powerups.query().delete()
                    .where('userId', this.msg.userId);
                break;
            case 'encounter/SelectSquare':
                await PlayerEncounters.query().delete()
                    .where('userId', this.msg.userId);
        }

        await UserCommands.reset(this.msg.userId);
    
        const embed = {
            title: 'Quit',
            description: `You quit.`
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: QuitCommand
}

function isQuittable(nextCommand) {
    switch(nextCommand) {
        case 'encounter/SelectSquare':
        case 'travel/SelectLocation':
        case 'encounter/StartEncounter':
        case 'transfer/ConfirmTransfer':
        case 'mail/OpenMail':
        case 'mail/ClaimRewards':
        case 'starter/SelectStarterPokemon':
        case 'powerup/PowerupResponse':
        case 'team/SelectTeam':
        case 'teams/QueryTeam':
        case 'teams/SelectSlot':
        case 'teams/SelectPokemon':
            return true;
        default:
            throw new CustomError('NON_QUITTABLE');
    }
}