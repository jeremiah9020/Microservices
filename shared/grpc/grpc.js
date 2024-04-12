const auth = require('./auth');
const cookbook = require('./cookbook');
const recipe = require('./recipe');
const user = require('./user');

module.exports = {
    auth,
    cookbook,
    recipe,
    user,
    def: {
        auth,
        cookbook,
        recipe,
        user
    }
}