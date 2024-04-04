const { Test, Status, Body, Headers } = require('../tests');
const {service} = require('../fetch');

new Test('Following -> Update -> Unauthorized', async () => {
    await service(3002, 'logout', 'post', {})

    return await service(3006, 'following', 'patch', {})
}, Status.Is(401));

new Test('Following -> Update -> No user matching remove', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3006, 'following', 'patch', {
        remove: ['123']
    })
}, Status.Is(200));

new Test('Following -> Update -> No user matching add', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3006, 'following', 'patch', {
        add: ['123']
    })
}, Status.Is(200));

new Test('Following -> Get -> No user matching add', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3006, '', 'get')
}, Status.Is(200), Body.HasValue('user.following',[]));


new Test('Following -> Update -> Added a user', async () => {
    await service(3002, 'register', 'post', {
        username: 'follow',
        email: 'follow@mail.com',
        password: 'pd'
    })

    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    await service(3006, 'following', 'patch', {
        add: ['follow']
    })

    const result = await service(3006, '', 'get')

    await service(3002, 'login', 'post', {
        user: 'follow',
        password: 'pd'
    })

    await service(3002, 'delete', 'post', {
        username: 'follow',
        password: 'pd'
    })

    return result;
}, Status.Is(200), Body.HasValue('user.following',['follow']));


new Test('Following -> Update -> Removed a user', async () => {
    await service(3002, 'register', 'post', {
        username: 'follow1',
        email: 'follow1@mail.com',
        password: 'pd'
    })

    await service(3002, 'register', 'post', {
        username: 'follow2',
        email: 'follow2@mail.com',
        password: 'pd'
    })


    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    await service(3006, 'following', 'patch', {
        add: ['follow1','follow2']
    })

    await service(3006, 'following', 'patch', {
        remove: ['follow1']
    })

    const result = await service(3006, '', 'get')

    await service(3002, 'login', 'post', {
        user: 'follow1',
        password: 'pd'
    })

    await service(3002, 'delete', 'post', {
        username: 'follow1',
        password: 'pd'
    })
    
    await service(3002, 'login', 'post', {
        user: 'follow2',
        password: 'pd'
    })

    await service(3002, 'delete', 'post', {
        username: 'follow2',
        password: 'pd'
    })

    return result;
}, Status.Is(200), Body.HasValue('user.following',['follow2']));