const RedeemCodes = require("~/knex/models/RedeemCodes");
const CustomError = require("~/lib//errors/CustomError");

module.exports = {
    async getItems(code) {
        const items = await RedeemCodes.query().select('rewards')
            .where('redeemId', code)
            .first();

        if(!items) {
            throw new CustomError('INVALID_REDEEM_CODE');
        }

        return items.rewards;
    }
}