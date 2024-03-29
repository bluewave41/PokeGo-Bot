const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Emojis = require('~/data/Lists/EmojiList');
const Command = require('./Command');
const { differenceInMilliseconds, add } = require('date-fns');
const User = require('~/knex/models/User');
const CustomError = require('~/lib/errors/CustomError');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const ItemEnums = require('~/data/Lists/ItemEnums');
const { raw } = require('objection');

const options = {
    names: ['daily'],
    expectedParameters: [],
}

class DailyCommand extends Command {
    constructor(msg) {
        super(msg, options);
    }
    async validate() {
        super.validate();
    }
    async run() {
        const user = await User.query().select('streak', 'lastDaily', 'currency')  
            .where('userID', this.msg.userId)
            .first();

        const newStreak = canWeDoDaily(user.lastDaily, user.streak);

        const earned = newStreak*100;
        if(earned > 2000) {
            earned = 2000;
        }

        await User.query().update({
            streak: newStreak,
            currency: raw(`currency + ${earned}`),
            lastDaily: new Date()
        })
        .where('userId',this.msg.userId);
    
        let description = `You're on a ${newStreak} day streak! You received:\n`;
        description += `- ${earned} ${Emojis.COIN}\n`;

        //TODO: should this be given every 3 days?
        if(newStreak %3 == 0) {
            await InventoryCommands.addItems(this.msg.userId, ItemEnums.TRAVEL_TICKET, 1);
            description += `- 1 Travel Ticket ${Emojis.TRAVEL_TICKET}`
        }
        
        let embed = {
            title: 'Daily',
            description: description,
            footer: `New total: ${user.currency+earned}.`
        }
    
        return EmbedBuilder.build(this.msg, embed);
    }
}

module.exports = {
    options: options,
    class: DailyCommand
}

function canWeDoDaily(lastDaily, streak) {
    if(!lastDaily) { //first time running daily
        return 1;
    }  

    const today = Date.now();
    const requiredForDaily = add(new Date(lastDaily), {days: 1});
    const expiredTime = add(new Date(lastDaily), {days: 2});

    if(today > expiredTime) { //daily expired
        return 1;
    }

    if(today > requiredForDaily) { //user can do daily
        return streak+1;
    }
    else {
        const ms = differenceInMilliseconds(requiredForDaily, today);
        const { hours, minutes, seconds} = msToTime(ms);
        throw new CustomError('DAILY_TOO_SOON', [hours, minutes, seconds]);
    }
}

function msToTime(time){
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
  
    let hours = Math.floor(time / hour % 24);
    let minutes = Math.floor(time / minute % 60);
    let seconds = Math.floor(time / second % 60);
   
  
    return {hours: hours, minutes: minutes, seconds: seconds}
}