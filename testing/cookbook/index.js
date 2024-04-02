const { Test, Status, Body, Headers } = require('../tests');
const {service} = require('../fetch');

new Test('Cookbook -> Create -> Unauthorized', async () => {
    await service(3002, 'logout', 'post', {})

    return await service(3003, '', 'post', {})
}, Status.Is(401));

new Test('Cookbook -> Create -> Missing title', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3003, '', 'post', {})
}, Status.Is(400));

new Test('Cookbook -> Create -> No id or visibility', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3003, '', 'post', {
        title: 'Testing Cookbook'
    })
}, Status.Is(200), Body.HasProperty('id'));

new Test('Cookbook -> Create -> With id and visibility', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3003, '', 'post', {
        title: 'Testing Cookbook',
        id: 'testingCookbook',
        visibility: 'private'
    })
}, Status.Is(200), Body.HasProperty('id'));

new Test('Cookbook -> Create -> Failed, duplicate id', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3003, '', 'post', {
        title: 'Testing Cookbook 2',
        id: 'testingCookbook',
    })
}, Status.Is(500));

new Test('Cookbook -> Get -> Missing id', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3003, '', 'get')
}, Status.Is(400));

new Test('Cookbook -> Get -> No cookbook', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3003, '?id=123', 'get')
}, Status.Is(404));

new Test('Cookbook -> Get -> Unauthorized', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    await service(3003, '', 'post', {
        id: 'privateCookbook',
        title: 'Private Testing Cookbook',
        visibility: 'private'
    })

    await service(3002, 'logout', 'post')

    return await service(3003, '?id=privateCookbook', 'get')
}, Status.Is(403));

new Test('Cookbook -> Get -> Success, same user', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3003, `?id=testingCookbook`, 'get')
}, Status.Is(200), Body.HasProperties([
    'cookbook.title',
    'cookbook.owner',
    'cookbook.times_copied',
    'cookbook.references',
    'cookbook.is_a_copy',
    'cookbook.visibility',
    'cookbook.sections'
]));

new Test('Cookbook -> Get -> Success, role', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })

    return await service(3003, `?id=privateCookbook`, 'get')
}, Status.Is(200), Body.HasProperties([
    'cookbook.title',
    'cookbook.owner',
    'cookbook.times_copied',
    'cookbook.references',
    'cookbook.is_a_copy',
    'cookbook.visibility',
    'cookbook.sections'
]));


new Test('Cookbook -> Update -> Unauthorized', async () => {
    await service(3002, 'logout', 'post')

    return await service(3003, '', 'patch', {
        id: 'testingCookbook',
        visbility: 'private'
    })
}, Status.Is(401));


new Test('Cookbook -> Update -> Lacking authorization', async () => {
    await service(3002, 'register', 'post', {
        username: 'cookbook',
        email: 'cookbook@mail.com',
        password: 'pd'
    })

    return await service(3003, '', 'patch', {
        id: 'testingCookbook',
        visbility: 'private'
    })
}, Status.Is(403));

new Test('Cookbook -> Update -> Missing visibility and sections', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3003, '', 'patch', {
        id: 'testingCookbook',
        visbility: 'private'
    })
}, Status.Is(400));

new Test('Cookbook -> Update -> Visibility', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    await service(3003, '', 'patch', {
        id: 'testingCookbook',
        visbility: 'private'
    })

    const result = await service(3003, '?id=testingCookbook', 'get')

    await service(3003, '', 'patch', {
        id: 'testingCookbook',
        visbility: 'public'
    })

    return result;
}, Status.Is(200));

new Test('Cookbook -> Update -> Data', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    await service(3003, '', 'patch', {
        id: 'testingCookbook',
        sections: [
            {
                title: 'Section1',
                recipes: [
                    {
                        id: 'test',
                        version: 'original'
                    }
                ]
            }
        ]
    })

    const result = await service(3003, '?id=testingCookbook', 'get')

    return result;
}, Status.Is(200), 
    Body.HasValue('cookbook.sections.0.title','Section1'),
    Body.HasValue('cookbook.sections.0.recipes.0.id','test'),
    Body.HasValue('cookbook.sections.0.recipes.0.version','original')
);


