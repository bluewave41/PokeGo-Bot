const fs = require('fs').promises;
const User = require('~/knex/models/User');

class TravelTicket {
    constructor() {
        this.id = 15;
        this.name = 'Travel Ticket';
        this.searchName = 'travelticket';
        this.plural = 'Travel Tickets';
        this.emoji = '<:ticket:722938227522142292>';
        this.description = 'Allows you to instantly travel to another square.';
        this.shopItem = false;
        this.price = 0;
        this.sellPrice = 0;
        this.fromPokestop = false;
        this.requiredLevel = 0;
        this.requiresEncounter = false;
        this.type = 'special';
    }
    async use(msg) {
        const json = { instantTravel: true }
        await User.query().update({
            nextCommand: 'travel/SelectLocation',
            saved: JSON.stringify(json)
        })
        .where('userId', msg.userId);

        const map = await fs.readFile('images/numberedmap.png', 'base64');

        return {
            embed: {
                title: 'Map',
                description: `Where would you like to go?\n**Current position: ** ${msg.location}`,
                base64: map,
            }
        }
    }
}

module.exports = new TravelTicket();