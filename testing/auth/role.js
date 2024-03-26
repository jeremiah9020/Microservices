const { Test, Status, Body, Headers } = require('../tests');
const service = require('../fetch');

new Test('Role -> Get -> Missing user', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3002, 'role', 'get')
}, Status.Is(400));

new Test('Role -> Get -> Unauthorized', async () => {
    await service(3002, 'logout', 'post');
    return await service(3002, 'role', 'get')
}, Status.Is(401));

new Test('Role -> Get -> No user', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3002, 'role?user=123', 'get')
}, Status.Is(404));

new Test('Role -> Get -> Success, same account', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3002, 'role?user=test', 'get')
}, Status.Is(200), Body.HasProperty('role'), Body.HasValue('role',0));


new Test('Role -> Get -> Success, has role', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })

    return await service(3002, 'role?user=test', 'get')
}, Status.Is(200));

new Test('Role -> Set -> Missing role', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })

    return await service(3002, 'role', 'put', {
        user: 'test'
    })
}, Status.Is(400));

new Test('Role -> Set -> Missing user', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })

    return await service(3002, 'role', 'put', {
        role: '1'
    })
}, Status.Is(400));

new Test('Role -> Set -> Unauthorized', async () => {
    await service(3002, 'logout', 'post', {})

    return await service(3002, 'role', 'put', {
        user: 'test',
        role: 1
    })
}, Status.Is(401));

new Test('Role -> Set -> No user', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })

    return await service(3002, 'role', 'put', {
        user: '123',
        role: 1
    })
}, Status.Is(404));

new Test('Role -> Set -> Successful', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })

    return await service(3002, 'role', 'put', {
        user: 'test',
        role: 1
    })
}, Status.Is(200));

new Test('Role -> Get -> Success, same account', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3002, 'role?user=test', 'get')
}, Body.HasValue('role',1));


