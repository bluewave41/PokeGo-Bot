const User = require('~/knex/models/User');
require('dotenv').config();
require('~/lib/Database');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');
const ItemEnums = require('./data/lists/ItemEnums');
    
async function start() {
    await InventoryCommands.removeItems(2, 2, 2);
}

start();

/*madge('./', {
	requireConfig: './config.js'
}).then(res => {
    console.log(res.circular());
})*/