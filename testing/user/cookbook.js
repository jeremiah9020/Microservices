const { Test, Status, Body, Headers, Expression } = require('../tests');
const { service } = require('../fetch');

new Test('User -> Cookbook -> Add', async () => {
    await service(3002, 'register', 'post', {
        username: 'cookbookAdd',
        email: 'cookbookAdd@mail.com',
        password: 'pd'
    })

    const test = await service(3006, '?username=test', 'get');

    await service(3006, 'cookbooks', 'patch', {
        add: [
            test.body.user.cookbooks[0]
        ]
    })

    const after = await service(3006, '', 'get');

    return after
}, Status.Is(200), Expression.Check(x => x.body.user.cookbooks.length == 2));

new Test('User -> Cookbook -> Remove and delete', async () => {
    await service(3002, 'register', 'post', {
        username: 'cookbookRemove',
        email: 'cookbookRemove@mail.com',
        password: 'pd'
    })

    const test = await service(3006, '', 'get');

    await service(3006, 'cookbooks', 'patch', {
        remove: [
            test.body.user.cookbooks[0]
        ]
    })

    const after = await service(3006, '', 'get');

    const cookbook = await service(3003, `?id=${test.body.user.cookbooks[0]}`, 'get');

    after.cookbookStatus = cookbook.status

    return after
}, Status.Is(200), Expression.Check(x => x.body.user.cookbooks.length == 0), Expression.Check(x => x.cookbookStatus == 404));

new Test('User -> Cookbook -> Remove and dont delete', async () => {
    await service(3002, 'login', 'post', {
        user: 'cookbookRemove',
        password: 'pd'
    })

    await service(3003, '', 'post', {
        title: 'Testing Cookbook',
        id: 'removeDontDelete',
    })

    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })
    
    await service(3006, 'cookbooks', 'patch', {
        add: [
            'removeDontDelete'
        ]
    })

    await service(3002, 'login', 'post', {
        user: 'cookbookRemove',
        password: 'pd'
    })

    await service(3006, 'cookbooks', 'patch', {
        remove: [
            'removeDontDelete'
        ]
    })

    return await service(3003, '?id=removeDontDelete', 'get');
}, Status.Is(200));