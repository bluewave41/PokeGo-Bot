const User = require('~/knex/models/User');
require('~/lib/Database');
    
async function start() {
	const user = await User.query().select('saved')
		.where('userId', 1)
		.first();
	console.log(user.json);
}

start();

/*madge('./', {
	requireConfig: './config.js'
}).then(res => {
    console.log(res.circular());
})*/