const { Test, Status, Body, Headers } = require('../tests');
const {service} = require('../fetch');

new Test('Recipe -> Create -> Unauthorized', async () => {
    await service(3002, 'logout', 'post', {})

    return await service(3005, '', 'post', {})
}, Status.Is(401));

new Test('Recipe -> Create -> Missing data', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'post', {

    })
}, Status.Is(400));

new Test('Recipe -> Create -> Missing data.title', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'post', {
        data: {
            text: 'text'
        }
    })
}, Status.Is(400));

new Test('Recipe -> Create -> Missing data.text', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'post', {
        data: {
            title: 'title'
        }
    })
}, Status.Is(400));

new Test('Recipe -> Create -> Success, no id or tag', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    const result = await service(3005, '', 'post', {
        data: {
            text: 'text',
            title: 'title'
        }
    })

    return result
}, Status.Is(200), Body.HasProperty('id'));

new Test('Recipe -> Create -> Success with id', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    const result = await service(3005, '', 'post', {
        id: 'test',
        data: {
            text: 'text',
            title: 'title'
        }
    })

    return result
}, Status.Is(200), Body.HasProperty('id'), Body.HasValue('id','test'));

new Test('Recipe -> Create -> Success with id and tag', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    const result = await service(3005, '', 'post', {
        id: 'tagged',
        tag: '123',
        data: {
            text: 'text',
            title: 'title'
        }
    })

    return result
}, Status.Is(200), Body.HasProperty('id'), Body.HasValue('id','tagged'));

new Test('Recipe -> Create -> Failed, duplicate', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    const result = await service(3005, '', 'post', {
        id: 'test',
        data: {
            text: 'text',
            title: 'title'
        }
    })

    return result
}, Status.Is(500));

new Test('Recipe -> Get -> Missing id', async () => {
    return await service(3005, '', 'get');
}, Status.Is(400));

new Test('Recipe -> Get -> No recipe', async () => {
    return await service(3005, '?id=123', 'get');
}, Status.Is(404));

new Test('Recipe -> Get -> Lacking authorization', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    await service(3005, '', 'post', {
        id: 'private',
        visibility: 'private',
        data: {
            text: 'text',
            title: 'title'
        }
    })

    await service(3002, 'logout', 'post')


    return await service(3005, '?id=private', 'get');
}, Status.Is(403));

new Test('Recipe -> Get -> Public recipe', async () => {
    await service(3002, 'logout', 'post')
    const result = await service(3005, '?id=test', 'get');

    return result
}, Status.Is(200), Body.HasProperties(['recipe','recipe.owner','recipe.visibility','recipe.rating','recipe.data','recipe.data.title','recipe.data.text']));

new Test('Recipe -> Get -> Private recipe, owner', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '?id=test', 'get');
}, Status.Is(200), Body.HasProperties(['recipe','recipe.owner','recipe.visibility','recipe.rating','recipe.data','recipe.data.title','recipe.data.text']));

new Test('Recipe -> Get -> Private recipe, admin', async () => {
    await service(3002, 'login', 'post', {
        user: 'admin',
        password: 'password'
    })
    
    return await service(3005, '?id=test', 'get');
}, Status.Is(200), Body.HasProperties(['recipe','recipe.owner','recipe.visibility','recipe.rating','recipe.data','recipe.data.title','recipe.data.text']));




new Test('Recipe -> Update -> Unauthorized', async () => {
    await service(3002, 'logout', 'post');

    return await service(3005, '', 'patch', {})
}, Status.Is(401));


new Test('Recipe -> Update -> Missing id', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'patch', {

    })
}, Status.Is(400));

new Test('Recipe -> Update -> No data', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'patch', {
        id: 'test'
    })
}, Status.Is(400));

new Test('Recipe -> Update -> Update visibility', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'patch', {
        id: 'test',
        visibility: 'private'
    })
}, Status.Is(200), Body.HasProperty('version'));

new Test('Recipe -> Update -> Missing title', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'patch', {
        id: 'test',
        data: {
            text: 'text updated'
        }
    })
}, Status.Is(400));

new Test('Recipe -> Update -> Missing text', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'patch', {
        id: 'test',
        data: {
            title: 'title updated'
        }
    })
}, Status.Is(400));

new Test('Recipe -> Update -> Update data', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    return await service(3005, '', 'patch', {
        id: 'test',
        data: {
            title: 'test updated',
            text: 'text updated'
        }
    })
}, Status.Is(200), Body.HasProperty('version'));


new Test('Recipe -> Get -> version tag', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    const result =  await service(3005, '', 'patch', {
        id: 'test',
        visibility: 'private',
        data: {
            title: 'test updated2',
            text: 'text updated2'
        }
    })
    
    return await service(3005, `?id=test&version=${result.body.version}`, 'get')
}, 
    Status.Is(200), 
    Body.HasValue('recipe.visibility','private'), 
    Body.HasValue('recipe.data.title','test updated2')
);