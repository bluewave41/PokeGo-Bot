const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Coordinates = require('~/data/Lists/CoordinateList');
const { add } = require('date-fns');
const TravelRequests = require('~/knex/models/TravelRequests');
const Command = require('../Command');
const CustomError = require('~/lib/errors/CustomError');
const ItemEnums = require('~/data/Lists/ItemEnums');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const User = require('~/knex/models/User');

const options = {
    names: [],
    expectedParameters: [
        { name: 'choice', type: 'string', optional: false }
    ],
    canQuit: true,
    info: 'Selecting a location to travel to'
}

class SelectLocation extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        this.choice = this.choice.toUpperCase();
    }
    async run() {
        if(!Coordinates.all.includes(this.choice)) {
            throw new CustomError('INVALID_TRAVEL_LOCATION');
        }

        //instant travel for travel ticket usage
        const user = await Userq.query().select('saved', 'location')
            .where('userId', this.msg.userId);
        const saved = user.json;

        if(user.location == this.choice) {
            throw new CustomError('OCCUPYING_LOCATION');
        }
        if(saved && saved.instantTravel) {
            await TravelRequests.query().delete()
                .where('userId', this.msg.userId);

            await InventoryCommands.removeItems(this.msg.userId, ItemEnums.TRAVEL_TICKET, 1);

            await User.query().update({
                nextCommand: null,
                saved: null,
                location: this.choice
            })
            .where('userId', this.msg.userId);

            const embed = {
                title: 'Traveled!',
                description: `You flew to square ${this.choice}!`,
            }

            return EmbedBuilder.build(this.msg, embed);
        }

        const user = await User.query().select('location')
            .where('userId', this.msg.userId)
            .first();

        const distance = Math.abs(user.location.charCodeAt(0) - this.choice.charCodeAt(0)) +
                Math.abs(parseInt(user.location.slice(1)) - parseInt(this.choice.slice(1)));

        const endTime = add(Date.now(), { minutes: distance*5 });

        //add the travel request
        await TravelRequests.query().insert({
            userId: this.msg.userId,
            location: this.choice,
            endTime: endTime
        });

        await User.reset(this.msg.userId);

        let embed = {
            title: 'Traveling',
            description: `You're moving to ${this.choice}. You'll be there in ${distance*5} minutes.`,
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: SelectLocation
}