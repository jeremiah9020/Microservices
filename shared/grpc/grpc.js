const auth = require('./auth');
const cookbook = require('./cookbook');
const recipe = require('./recipe');
const user = require('./user');

module.exports = {
    auth: auth.services,
    cookbook: cookbook.services,
    recipe: recipe.services,
    user : user.services,
    def: {
        auth: auth.def,
        cookbook: cookbook.def,
        recipe: recipe.def,
        user: user.def
    }
}