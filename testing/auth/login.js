const { Test, Status, Body, Headers } = require('../tests');
const {service} = require('../fetch');

new Test('Login -> Missing user', async () => {
    return await service(3002, 'login', 'post', {
        password: 'pd'
    })
}, Status.Is(400));

new Test('Login -> Missing password', async () => {
    return await service(3002, 'login', 'post', {
        user: 'test',
    })
}, Status.Is(400));

new Test('Login -> Incorrect password', async () => {
    return await service(3002, 'login', 'post', {
        user: 'test',
        password: '123'
    })
}, Status.Is(401));


new Test('Login -> Successful by username', async () => {
    return await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })
}, Status.Is(201), Body.HasProperty('access_token'), Headers.SetsCookie('ACCESSTOKEN'));

new Test('Login -> Successful by email', async () => {
    return await service(3002, 'login', 'post', {
        user: 'test@mail.com',
        password: 'pd'
    })
}, Status.Is(201), Body.HasProperty('access_token'), Headers.SetsCookie('ACCESSTOKEN'));