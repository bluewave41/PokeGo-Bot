require('dotenv').config();
require('app-module-path').addPath(__dirname);
const madge = require('madge');
const RocketTable = require('./commands/battle/RocketTable');

console.log(RocketTable);

madge('./', {
	requireConfig: './config.js'
}).then(res => {
    console.log(res.circular());
})
