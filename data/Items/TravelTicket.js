const fs = require('fs').promises;
const UserCommands = require('~/data/ModelHandlers/UserCommands');

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
        await UserCommands.update(msg.userId, [
            { rowName: 'nextCommand', value: 'travel/SelectLocation' },
            { rowName: 'saved', value: JSON.stringify(json) }
        ]);

        const map = await fs.readFile('images/numberedmap.png', 'base64');

        let embed = {
            title: 'Map',
            description: `Where would you like to go?\n**Current position: ** ${msg.location}`,
            base64: map,
        }

        return embed;
    }
}

module.exports = new TravelTicket();