const { Test, Status, Body, Headers } = require('../tests');
const service = require('../fetch');

new Test('Timeout -> Get -> Missing username', async () => {
    return await service(3002, 'timeout', 'get')
}, Status.Is(400));

new Test('Timeout -> Get -> No user', async () => {
    return await service(3002, 'timeout?username=123', 'get')
}, Status.Is(404));

new Test('Timeout -> Get -> Successful', async () => {
    return await service(3002, 'timeout?username=test', 'get')
}, Status.Is(200), Body.HasValue('timeout_until', 0));

new Test('Timeout -> Set -> Missing username', async () => {
    return await service(3002, 'timeout?username=test', 'put', {
        timeout_until: Date.now() + 10000
    })
}, Status.Is(400));

new Test('Timeout -> Set -> Missing timeout_until', async () => {
    return await service(3002, 'timeout?username=test', 'put', {
        username: 'test'
    })
}, Status.Is(400));

new Test('Timeout -> Set -> No authorization', async () => {
    await service(3002, 'logout', 'post', {})

    return await service(3002, 'timeout?username=test', 'put', {
        username: 'test',
        timeout_until: Date.now() + 10000
    })
}, Status.Is(401));

new Test('Timeout -> Set -> Incorrect authorization', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3002, 'timeout?username=test', 'put', {
        username: 'test',
        timeout_until: Date.now() + 10000
    })
}, Status.Is(403));

new Test('Timeout -> Set -> No user', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })

    return await service(3002, 'timeout?username=test', 'put', {
        username: '123',
        timeout_until: 1
    })
}, Status.Is(404));

new Test('Timeout -> Set -> Success', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })

    return await service(3002, 'timeout?username=test', 'put', {
        username: 'test',
        timeout_until: 1
    })
}, Status.Is(200));

new Test('Timeout -> Get -> Successful', async () => {
    return await service(3002, 'timeout?username=test', 'get')
}, Status.Is(200), Body.HasValue('timeout_until', 1));