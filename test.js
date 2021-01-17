require('dotenv').config();
require('app-module-path').addPath(__dirname);
const madge = require('madge');

madge('./').then(res => {
    console.log(res);
    console.log(res.circular());
})