const EmbedBuilder = require('~/data/Builders/EmbedBuilder');
const Emojis = require('~/data/Lists/EmojiList');
const Command = require('./Command');
const { differenceInMilliseconds, add } = require('date-fns');
const UserCommands = require('../data/ModelHandlers/UserCommands');
const CustomError = require('~/lib/errors/CustomError');

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
        const user = await UserCommands.getFields(this.msg.userId, ['streak',' lastDaily', 'currency']);
        const newStreak = canWeDoDaily(user.lastDaily, user.streak);

        const earned = newStreak*100;
        if(earned > 2000) {
            earned = 2000;
        }
    
        await UserCommands.update(this.msg.userId, [
            { rowName: 'streak', value: user.newStreak },
            { rowName: 'currency', value: earned, flag: 'increment' },
            { rowName: 'lastdaily', value: new Date() }
        ]);
        
        let embed = {
            title: 'Daily',
            description: `You're on a ${newStreak} day streak and you received ${earned} ${Emojis.COIN}!`,
            footer: `New total: ${currency+earned}.`
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