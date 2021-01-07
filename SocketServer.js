class SocketServer {
    constructor(client) {
        this.client = client;
        this.socket = require('socket.io-client')(process.env.socketUrl);
        this.initialize();
    }
    initialize() {
        const self = this;
        this.socket.on('connect', function() {
            console.log('connected');
        });
        
        this.socket.on('locationUpdate', async function(updates) {
            for(var i=0;i<updates.length;i++) {
                const user = await self.client.users.fetch(updates[i].discordId);
                user.send(`You've travelled to square ${updates[i].location}!`);
            }
        });
    }
}

module.exports = SocketServer;