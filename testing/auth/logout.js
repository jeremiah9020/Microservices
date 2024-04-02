const { Test, Status, Body, Headers } = require('../tests');
const {service} = require('../fetch');

new Test('Logout', async () => {
    return await service(3002, 'logout', 'post', {})
}, Status.Is(200), Headers.SetsCookie('ACCESSTOKEN'));
