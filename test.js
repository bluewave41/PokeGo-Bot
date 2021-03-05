require('dotenv').config();
require('~/lib/Database');
const madge = require('madge');
const InventoryCommands = require('~/data/ModelHandlers/InventoryCommands');

async function stuff() {
	const a = await InventoryCommands.getItems(6, [1]);
	console.log(a);
}

//stuff();


madge('./', {
	requireConfig: './config.js'
}).then(res => {
    console.log(res.circular());
})