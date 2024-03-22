const fs = require('fs');
const path = require('path');


function env() {
    const file = fs.readFileSync(path.join(__dirname, '../.env'), {encoding: 'utf-8'});
    return JSON.parse(file);
}

module.exports = env();