const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const fs = require('fs').promises;
const TravelRequests = require('~/knex/models/TravelRequests');
const Coordinates = require('~/data/Lists/CoordinateList');
const UserCommands = require('~/data/ModelHandlers/UserCommands');
const { add } = require('date-fns');
const Command = require('./Command');
const CustomError = require('~/lib/errors/CustomError');

const options = {
    names: ['travel'],
    expectedParameters: [
        { name: 'choice', type: 'string', optional: true }
    ]
}

class TravelCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
        if(this.choice) {
            this.choice = this.choice.toUpperCase();
        }
    }
    async run() {
        //is the user already travelling?
        const travelRequest = await TravelRequests.query().select('*')
            .where('userId', this.msg.userId);

        //temporary code
        if(travelRequest.length) {
            throw new CustomError('ALREADY_TRAVELING');
        }

        if(this.choice) {
            if(!Coordinates.all.includes(this.choice.toUpperCase())) {
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
        else {
            await UserCommands.update(this.msg.userId, [
                { rowName: 'nextCommand', value: 'travel/SelectLocation' }
            ]);

            const map = await fs.readFile('images/numberedmap.png', 'base64');

            let embed = {
                title: 'Map',
                description: `Where would you like to go?\nMoving up, down, left or right takes 5 minutes.\n**Current position: ** ${this.msg.location}`,
                base64: map,
            }
    
            return EmbedBuilder.build(this.msg, embed);
        }
    }
}

module.exports = {
    options: options,
    class: TravelCommand
}