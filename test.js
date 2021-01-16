const madge = require('madge');

madge('./').then((res) => {
    console.log(res.circular());
});