const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const fs = require('fs').promises;
const TravelRequests = require('~/knex/models/TravelRequests');
const User = require(`~/knex/models/User`);
const Coordinates = require('~/data/Lists/CoordinateList');
const { add, differenceInMilliseconds } = require('date-fns');
const Command = require('./Command');
const CustomError = require('~/lib/errors/CustomError');
const Utils = require('~/lib/Utils');

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
        if(this.choice && this.choice != 'cancel') {
            this.choice = this.choice.toUpperCase();
        }
    }
    async run() {
        //is the user already travelling?
        const travelRequest = await TravelRequests.query().select('*')
            .where('userId', this.msg.userId)
            .first();

        if(this.choice == 'cancel') {
            if(!travelRequest) {
                throw new CustomError('NOT_TRAVELING');
            }
            await TravelRequests.query().delete()
                .where('userId', this.msg.userId);
            return EmbedBuilder.build(this.msg, {
                title: 'Travel Canceled',
                description: `You've canceled your travel request.`
            });
        }

        //temporary code
        if(travelRequest) {
            const timeRemaining = Utils.msToTime(differenceInMilliseconds(new Date(travelRequest.endTime), Date.now()));
            if(timeRemaining.seconds < 0 || timeRemaining.minutes < 0 || timeRemaining.hours < 0) {
                //remove their request
                await TravelRequests.query().delete()
                    .where('userId', this.msg.userId);
                //update user location
                await User.query().update({
                    location: travelRequest.location
                })
                .where('userId', this.msg.userId);

                return EmbedBuilder.build(this.msg, {
                    title: 'Traveled',
                    description: `You've traveled to square ${travelRequest.location}!`
                });
            }
            else {
                let timeString = `You're already traveling to ${travelRequest.location}. You'll be there in`;
                if(timeRemaining.hours) {
                    timeString += ' ' + timeRemaining.hours + (timeRemaining.hours == 1 ? ' hour' : '  hours');
                }
                if(timeRemaining.minutes) {
                    timeString += ' ' + timeRemaining.minutes + (timeRemaining.minutes == 1 ? ' minute' : ' minutes');
                }
                if(timeRemaining.seconds) {
                    timeString += ' ' + timeRemaining.seconds + (timeRemaining.seconds == 1 ? ' second' : ' seconds');
                }
                timeString += '.';
                const embed = {
                    title: 'Already Traveling',
                    description: timeString,
                    footer: `You can stop at any time with ${this.msg.prefix}travel cancel.`
                }
                return EmbedBuilder.build(this.msg, embed);
            }
        }

        if(this.choice) {
            if(!Coordinates.all.includes(this.choice)) {
                throw new CustomError('INVALID_TRAVEL_LOCATION');
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
                title: 'Travelling',
                description: `You're moving to ${this.choice}. You'll be there in ${distance*5} minutes.`,
            }
        
            return EmbedBuilder.build(this.msg, embed);
        }
        else {
            await User.setNextCommand(this.msg.userId, 'travel/SelectLocation');

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