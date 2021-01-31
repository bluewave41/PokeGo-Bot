require('dotenv').config();
require('app-module-path').addPath(__dirname);
const madge = require('madge');

/*madge('./').then(res => {
    console.log(res);
    console.log(res.circular());
})*/

const PokemonBuilder = require('~/lib/PokemonBuilder');
const RocketPokemon = require('~/knex/models/RocketPokemon');
require('~/lib/Database');

const id = 1;

async function start() {
	const p1 = PokemonBuilder.generateRocketPokemon(1, 40);
	const p2 = PokemonBuilder.generateRocketPokemon(4, 40);
	const p3 = PokemonBuilder.generateRocketPokemon(7, 40);
	p1.rocketId = 1;
	p2.rocketId = 1;
	p3.rocketId = 1;
	delete p1['shiny'];
	delete p2['shiny'];
	delete p3['shiny'];
	
	await RocketPokemon.query().insert(p1.rocketInsert);
	await RocketPokemon.query().insert(p2.rocketInsert);
	await RocketPokemon.query().insert(p3.rocketInsert);
}

start();