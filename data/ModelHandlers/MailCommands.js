const Mail = require("~/knex/models/Mail");
const MailRewards = require("~/knex/models/MailRewards");
const Emojis = require("~/data/Lists/EmojiList");
const CustomError = require("~/lib/errors/CustomError");
const LevelList = require("~/data/Lists/LevelList");
const { raw } = require('objection');

module.exports = {
    async addLevelUpMail(userId, level) {
        const message = `Congratulations! You are now level ${level}. You can claim your rewards attached to this message.`;
        let rewards = LevelList[level-1].rewards;
        let rewardString = LevelList[level-1].rewardString;
        console.log(level, rewards, rewardString)

        const mail = await Mail.query().insert({
            userId: userId,
            title: `Level ${level}!`,
            message: message,
            hasRewards: true,
            rewardString: rewardString
        });

        rewards.forEach(el => el.mailId = mail.id);

        await MailRewards.knex().table('mail_rewards').insert(rewards);
    },
    async addTeamMail(userId) {
      const message = `Congratulations! You've reached level 5 and can now select a team. There are 3 teams for you to chose from:\n\
      Valor ${Emojis.VALOR}\nMystic ${Emojis.MYSTIC}\nInstinct ${Emojis.INSTINCT}\n\nYou can select a team with the team command`;
      
      await Mail.query().insert({
          userId: userId,
          title: 'Select a team!',
          message: message
      });
    },
    async getMailTitles(userId, page) {
        const mail = await Mail.query().select('title', 'read', 'claimedRewards', 'hasRewards', raw('COUNT(*) OVER() AS count'))
            .where('userId', userId)
            .orderBy('id')
            .limit(25)
            .offset((page-1)*25);
        return mail;
    },
    async getMailBody(userId, tableId) {
        tableId -= 1; //adjust for index starting at 0
        const allMail = await Mail.query().select('id', 'title', 'message', 'claimedRewards', 'hasRewards', 'rewardString')
            .withGraphFetched('rewards')
            .where('userId', userId);

        if(tableId >= allMail.length) {
            throw new CustomError('NO_MAIL', tableId+1);
        }

        let mail = allMail[tableId];

        await Mail.query().update({
            read: true,
        })
        .where('id', mail.id);

        mail.rewardDisplay = mail.rewardString.split(',');

        return mail;
    },
    async getRewards(userId, mailId) {
        const mail = await Mail.query().select('claimedRewards', 'rewardString')
            .withGraphFetched('rewards')
            .where('userId', userId)
            .where('id', mailId)
            .first();

        if(mail.claimedRewards) {
            throw new CustomError('ALREADY_CLAIMED');
        }

        mail.rewardDisplay = mail.rewardString.split(',');

        return mail;
    }
}