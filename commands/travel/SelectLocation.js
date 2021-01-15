const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Coordinates = require('~/data/Lists/CoordinateList');
const { add } = require('date-fns');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const TravelRequests = require('~/knex/models/TravelRequests');
const Command = require('../Command');
const CustomError = require('~/lib/errors/CustomError');

const options = {
    names: [],
    expectedParameters: [
        { name: 'choice', type: 'string', optional: false }
    ]
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

        const oldLocation = (await UserCommands.getFields(this.msg.userId, 'location')).location;

        const distance = Math.abs(oldLocation.charCodeAt(0) - this.choice.charCodeAt(0)) +
                Math.abs(parseInt(oldLocation.slice(1)) - parseInt(this.choice.slice(1)));

        const endTime = add(Date.now(), { minutes: distance*5 });

        //add the travel request
        await TravelRequests.query().insert({
            userId: this.msg.userId,
            location: this.choice,
            end_time: endTime
        });

        await UserCommands.reset(this.msg.userId);

        let embed = {
            title: 'Travelling',
            description: `You're moving to ${this.choice}. You'll be there in ${distance*5} minutes.`,
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: SelectLocation
}