const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');
const Emojis = require('../Emojis');

module.exports = async function(msg) {
    const response = await axios.post(process.env.url + 'user/info', {userId: msg.userId});
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let status;

    switch(msg.nextCommand) {
        case 'encounter/SelectSquare':
            status = 'Catching a Pokemon.';
            break;
        case 'travel/SelectLocation':
            status = 'Selecting a new travel location.';
            break;
        case 'encounter/StartEncounter':
            status = 'Browsing Pokemon in the area.';
            break;
        case 'starter/SelectStarterPokemon':
            status = 'Selecting a starter Pokemon.';
            break;
        case 'transfer/ConfirmTransfer':
            status = 'Transferring a Pokemon.';
            break;
        case 'mail/OpenMail':
            status = 'Browsing mail.';
            break;
        default:
            status = 'Nothing right now.';
    }

    const user = response.data;

    const embed = {
        title: msg.author.username + "'s Info",
        description: '',
        thumbnail: `http://www.bluewave41.xyz:5000/teams/${msg.team}.png`,
        fields: [
            ['Pokemon Count', user.pokemonCount, false],
            ['Currency', user.currency + ' ' + Emojis.COIN, true],
            ['Stardust', user.stardust + Emojis.STARDUST, true],
            ['Location', user.location, false],
            ['Pokemon Storage', user.pokemonCount + '/' + user.storage, true],
            ['Item Storage',  user.itemCount + '/' + user.itemstorage, true],
            ['Player Progress', `Level: ${user.level}\nXP: ${user.xp}/${user.requiredXP} - ${user.totalxp} total XP`],
            ['Current Status', status, false],
        ]
    }

    return EmbedBuilder.build(msg, embed);
}