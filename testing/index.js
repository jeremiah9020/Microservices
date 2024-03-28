const { run } = require('./tests')

require('./auth/register');
require('./auth/login');
require('./auth/logout');
require('./auth/delete');
require('./auth/role');
require('./auth/timeout');

require('./user/index');
require('./user/following');

run();