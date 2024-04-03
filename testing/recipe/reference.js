const { Test, Status, Body, Headers, Expression } = require('../tests');
const { service, server } = require('../fetch');

new Test('Recipe -> Reference -> Increment -> Missing id', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/increment/', 'post', {})
}, Status.Is(400));


new Test('Recipe -> Reference -> Increment -> No recipe', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/increment/', 'post', {
        id: '123'
    })
}, Status.Is(404));


new Test('Recipe -> Reference -> Increment -> Success', async () => {
    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    await service(3005, '', 'post', {
        id: 'increment',
        data: {
            text: 'increment me',
            title: 'increment me'
        }
    })

    const before = await service(3005, 'metadata?id=increment', 'get')


    const result = await server('RecipeService', '/reference/increment/', 'post', {
        id: 'increment'
    })

    const after = await service(3005, 'metadata?id=increment', 'get')




    result.before = before.body.metadata.references;
    result.after = after.body.metadata.references;

    return result;
}, Status.Is(200), Expression.Check(x => x.after == x.before + 1));






new Test('Recipe -> Reference -> Decrement -> Missing id', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/decrement/', 'post', {})
}, Status.Is(400));

new Test('Recipe -> Reference -> Decrement -> No recipe', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/decrement/', 'post', {
        id: '123',
    })
}, Status.Is(404));

new Test('Recipe -> Reference -> Decrement -> Success', async () => {

    await service(3002, 'login', 'post', {
        user: 'test',
        password: 'pd'
    })

    await service(3005, '', 'post', {
        id: 'decrement',
        data: {
            text: 'decrement me',
            title: 'decrement me'
        }
    })

    await server('RecipeService', '/reference/increment/', 'post', {
        id: 'decrement'
    })

    await server('RecipeService', '/reference/increment/', 'post', {
        id: 'decrement'
    })

    const before = await service(3005, 'metadata?id=decrement', 'get')

    const result = await server('RecipeService', '/reference/decrement/', 'post', {
        id: 'decrement'
    })

    const after = await service(3005, 'metadata?id=decrement', 'get')

    result.before = before.body.metadata.references;
    result.after = after.body.metadata.references;

    return result;
}, Status.Is(200), Expression.Check(x => x.after == x.before - 1));


new Test('Recipe -> Reference -> Delete Recipe', async () => {
    await service(3002, 'login', 'post', {
        username: 'test',
        password: 'pd'
    })

    await service(3005, '', 'post', {
        id: 'deleteme',
        data: {
            text: 'Delete me please',
            title: 'Delete Me'
        }
    })

    await server('RecipeService', '/reference/decrement/', 'post', {
        id: 'deleteme',
        version: 'original'
    })

    return await service(3005, 'metadata?id=deleteme', 'get');
}, Status.Is(404));
