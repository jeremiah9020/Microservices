const { run } = require('./tests')

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