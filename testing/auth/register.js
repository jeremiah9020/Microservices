const { Test, Status, Body, Headers } = require('../tests');
const service = require('../fetch');

new Test('Register -> Missing username', async () => {
    return await service(3002, 'register', 'post', {
        email:'test@mail.com',
        password:'pd'
    })
}, Status.Is(400));

new Test('Register -> Missing email', async () => {
    return await service(3002, 'register', 'post', {
        username:'test',
        password:'pd'
    })
}, Status.Is(400));

new Test('Register -> Missing password', async () => {
    return await service(3002, 'register', 'post', {
        username:'test',
        email:'test@mail.com'
    })
}, Status.Is(400));

new Test('Register -> success', async () => {
    return await service(3002, 'register', 'post', {
        username:'test',
        email:'test@mail.com',
        password:'pd'
    })
}, Status.Is(201), Body.HasProperty('access_token'), Headers.SetsCookie('ACCESSTOKEN'));

new Test('Register -> username registered', async () => {
    return await service(3002, 'register', 'post', {
        username:'test',
        email:'test@mail.com',
        password:'pd'
    })
}, Status.Is(409));