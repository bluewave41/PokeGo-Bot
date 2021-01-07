const axios = require('axios');

axios.defaults.headers.post['errors'] = 'discord';
axios.defaults.headers.post['client'] = 'discord';

module.exports = axios;