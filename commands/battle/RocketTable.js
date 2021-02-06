const PokemonData = require('~/data/PokemonData');

let rocketData = [
    {
        type: 'bug',
        message: 'Go, my super bug Pokemon!',
        possible: [],
        catchable: [],
    },
    {
        type: 'poison',
        message: "Coiled and ready to strike!",
        possible: [],
        catchable: [],
    },
    {
        type: 'normal',
        message: 'Normal does not mean weak.',
        possible: [],
        catchable: [],
    },
    {
        type: 'dragon',
        message: "ROAR! ... How'd that sound?",
        possible: [],
        catchable: [],
    },
    {
        type: 'grass',
        message: "Don't tangle with us!",
        possible: [],
        catchable: [],
    },
    {
        type: 'flying',
        message: 'Battle against my Flying-type Pokemon!',
        possible: [],
        catchable: [],
    },
    {
        type: 'fire',
        message: 'Do you know how hot Pokemon fire breath can get?',
        possible: [],
        catchable: [],
    },
    {
        type: 'ground',
        message: "You'll be defeated into the ground!",
        possible: [],
        catchable: [],
    },
    {
        type: 'psychic',
        message: 'Are you scared of psychics than use unseen power?',
        possible: [],
        catchable: [],
    },
    {
        type: 'rock',
        message: 'Lets rock and roll!',
        possible: [],
        catchable: [],
    },
    {
        type: 'ghost',
        message: "Ke... ke... ke... ke... ke... ke...",
        possible: [],
        catchable: [],
    },
    {
        type: 'fighting',
        message: "This buff physique isn't just for show!",
        possible: [],
        catchable: [],
    },
    {
        type: 'ice',
        message: "You're gonna be frozen in your tracks.",
        possible: [],
        catchable: [],
    },
    {
        type: 'electric',
        message: 'Get ready to be shocked!',
        possible: [],
        catchable: [],
    },
    {
        type: 'fairy',
        message: 'Check out my cute Pokemon!',
        possible: [],
        catchable: [],
    },
    {
        type: 'steel',
        message: "You're no match for my iron will!",
        possible: [],
        catchable: [],
    },
    {
        type: 'water',
        message: "These waters are treacherous!",
        possible: [],
        catchable: [],
    }
]

const values = Object.values(PokemonData);

for(var i=0;i<values.length;i++) {
    const pokemon = values[i];
    let arr = rocketData.find(el => el.type == pokemon.type1);
    let arr2 = rocketData.find(el => el.type == pokemon.type2);
    arr.possible.push(pokemon.pokedexID);
    if(pokemon.type2) {
        arr2.possible.push(pokemon.pokedexID);
    }
    if(pokemon.stage == 1) {
        arr.catchable.push(pokemon.pokedexID);
        if(pokemon.type2) {
            arr2.catchable.push(pokemon.pokedexID);
        }
    }
}

module.exports = rocketData;