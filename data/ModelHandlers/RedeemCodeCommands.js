const RedeemCodes = require("~/knex/models/RedeemCodes");
const CustomError = require("./errors/CustomError");

module.exports = {
    async getItems(code, error) {
        const items = await RedeemCodes.query().select('rewards')
        .where('redeemId', code);

        if(!items) {
            throw new CustomError(error);
        }

        return JSON.parse(items[0].rewards)[0];
    }
}