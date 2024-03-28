const { Test, Status, Body, Headers } = require('../tests');
const service = require('../fetch');

new Test('User -> Get -> Missing username && not logged in', async () => {
    await service(3002, 'logout', 'post', {})

    return await service(3006, '', 'get')
}, Status.Is(400));

new Test('User -> Get -> No user', async () => {
    await service(3002, 'logout', 'post', {})

    return await service(3006, '?username=123', 'get')
}, Status.Is(404));

new Test('User -> Get -> Success by username', async () => {
    await service(3002, 'logout', 'post', {})


    return await service(3006, '?username=test', 'get')
}, Status.Is(200), Body.HasProperties(['user.recipes', 'user.cookbooks', 'user.followers', 'user.following', 'user.data']));


new Test('User -> Get -> Success by logged in', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3006, '', 'get')
}, Status.Is(200), Body.HasProperties(['user.recipes', 'user.cookbooks', 'user.followers', 'user.following', 'user.data']));

new Test('User -> Update -> Unauthorized', async () => {
    await service(3002, 'logout', 'post', {});

    return await service(3006, '', 'patch', {
        username: 'test',
        data: { description: 'updated!'}
    })
}, Status.Is(401));

new Test('User -> Update -> Missing data', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3006, '', 'patch', {
        username: 'test'
    })
}, Status.Is(400));

new Test('User -> Update -> Success', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3006, '', 'patch', {
        username: 'test',
        data: { description: 'Updated description'}
    })
}, Status.Is(200));

new Test('User -> Get -> Updated', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3006, '', 'get')
}, Status.Is(200), Body.HasValue('user.data.description', 'Updated description'));




