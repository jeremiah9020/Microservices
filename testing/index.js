const { run } = require('./tests')

const { Test, Status, Body, Headers, Expression } = require('./tests');
const {service} = require('./fetch');

require('./auth/register');
require('./auth/login');
require('./auth/logout');
require('./auth/delete');
require('./auth/role');
require('./auth/timeout');

require('./user/index');
require('./user/following');
require('./user/cookbook');

require('./recipe/index');
require('./recipe/metadata');
require('./recipe/reference');

require('./cookbook/index');
require('./cookbook/copy');

require('./feed/home');
require('./feed/query');

run();