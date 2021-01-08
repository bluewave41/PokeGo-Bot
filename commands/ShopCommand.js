const axios = require('axios');
const EmbedBuilder = require('../EmbedBuilder');
const Emojis = require('../Emojis');

module.exports = async function(msg) {

    let amount;

    let lastParameter = msg.parameters[msg.parameters.length-1];
    if(!Number.isInteger(parseInt(lastParameter))) {
        amount = 1;
    }
    else {
        amount = lastParameter;
        msg.parameters.pop();
    }

    let data = {
        userId: msg.userId,
        amount: amount,
    }

    if(msg.parameters) {
        data.action = msg.parameters.shift(),
        data.name = msg.parameters.join('')
    }

    let url;

    switch(data.action) {
        case 'buy':
            url = process.env.url + 'shop/buy';
            break;
        case 'sell':
            url = process.env.url + 'shop/sell';
            break;
        default:
            url = process.env.url + 'shop/list';
            break
    }

    const response = await axios.post(url, data);
    if(response.data.error) {
        return { error: true, message: response.data.error };
    }

    let embed = {
        title: 'Shop',
        description: '',
        fields: [],
    }

    const { items, currency, item, cost, newCurrency } = response.data;

    switch(data.action) {
        case 'buy':
            embed.description = `You bought ${amount} ${amount == 1 ? item.name : item.plural} for ${cost} ${Emojis.COIN}!`;
            embed.footer = `You now have: ${newCurrency}₽.`
            break;
        case 'sell':
            embed.description = `You sold ${amount} ${amount == 1 ? item.name : item.plural} for ${item.sellPrice * amount} ${Emojis.COIN}.`;
            embed.footer = `You now have: ${newCurrency}₽.`
            break;
        default:
            embed.description = "Welcome! What would you like to buy?";
            for(var i=0;i<items.length;i++) {
                let item = items[i];
                embed.fields.push([item.name, `${item.emoji}\n${item.description}\n**${item.price}₽**`, false]);
            }
            embed.footer = `You have ${currency}₽.`;
            break;
    }

    return EmbedBuilder.build(msg, embed);
}