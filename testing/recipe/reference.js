const { Test, Status, Body, Headers, Expression } = require('../tests');
const { service, server } = require('../fetch');

new Test('Recipe -> Reference -> Increment -> Missing id and version', async () => {

    await service(3002, 'logout', 'post', {})

    return await server('RecipeService','/reference/increment/','post', {})
}, Status.Is(400));

new Test('Recipe -> Reference -> Increment -> Missing id', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/increment/', 'post', {
        id: 'test'
    })
}, Status.Is(400));

new Test('Recipe -> Reference -> Increment -> Missing version', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/increment/', 'post', {
        version: 'original'
    })
}, Status.Is(400));

new Test('Recipe -> Reference -> Increment -> No recipe', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/increment/', 'post', {
        id: '123',
        version: 'original'
    })
}, Status.Is(404));

new Test('Recipe -> Reference -> Increment -> No version', async () => {
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

    return await server('RecipeService', '/reference/increment/', 'post', {
        id: 'increment',
        version: '12345'
    })
}, Status.Is(404));

new Test('Recipe -> Reference -> Increment -> Success', async () => {
    const before = await service(3005, '?id=increment&version=original', 'get')


    const result = await server('RecipeService', '/reference/increment/', 'post', {
        id: 'increment',
        version: 'original'
    })

    const after = await service(3005, '?id=increment&version=original', 'get')


    result.before = before.body.recipe.references;
    result.after = after.body.recipe.references;

    return result;
}, Status.Is(200), Expression.Check(x => x.after == x.before + 1));







new Test('Recipe -> Reference -> Decrement -> Missing id and version', async () => {

    await service(3002, 'logout', 'post', {})

    return await server('RecipeService','/reference/decrement/','post', {})
}, Status.Is(400));

new Test('Recipe -> Reference -> Decrement -> Missing id', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/decrement/', 'post', {
        id: 'test'
    })
}, Status.Is(400));

new Test('Recipe -> Reference -> Decrement -> Missing version', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/decrement/', 'post', {
        version: 'original'
    })
}, Status.Is(400));

new Test('Recipe -> Reference -> Decrement -> No recipe', async () => {
    await service(3002, 'logout', 'post', {})

    return await server('RecipeService', '/reference/decrement/', 'post', {
        id: '123',
        version: 'original'
    })
}, Status.Is(404));

new Test('Recipe -> Reference -> Decrement -> No version', async () => {
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

    return await server('RecipeService', '/reference/decrement/', 'post', {
        id: 'decrement',
        version: '12345'
    })
}, Status.Is(404));

new Test('Recipe -> Reference -> Decrement -> Success', async () => {
    const before = await service(3005, '?id=decrement&version=original', 'get')


    const result = await server('RecipeService', '/reference/decrement/', 'post', {
        id: 'decrement',
        version: 'original'
    })

    const after = await service(3005, '?id=decrement&version=original', 'get')


    result.before = before.body.recipe.references;
    result.after = after.body.recipe.references;

    return result;
}, Status.Is(200), Expression.Check(x => x.after == x.before - 1));