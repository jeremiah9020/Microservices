const { Test, Status, Body, Headers, Expression } = require('../tests');
const {service} = require('../fetch');

new Test('Delete -> Missing username', async () => {
    return await service(3002, 'delete', 'post', {
        password:'pd'
    })
}, Status.Is(400));

new Test('Delete -> Missing password', async () => {
    return await service(3002, 'delete', 'post', {
        username:'test'
    })
}, Status.Is(400));

new Test('Delete -> Incorrect password', async () => {
    return await service(3002, 'delete', 'post', {
        username:'test',
        password:'123'
    })
}, Status.Is(401));

new Test('Delete -> Success', async () => {
    await service(3002, 'register', 'post', {
        username:'deleteHelper',
        email:'deleteHelper@mail.com',
        password:'pd'
    })

    await service(3003, '', 'post', {
        title: 'Testing Cookbook',
        id: 'deleteHelperCookbook'
    })

     await service(3005, '', 'post', {
        id: 'deleteHelperRecipe',
        data: {
            text: 'text',
            title: 'title'
        }
    })

    await service(3002, 'register', 'post', {
        username:'delete',
        email:'delete@mail.com',
        password:'pd'
    })

    await service(3006, 'following', 'patch', {
        add: [ 'deleteHelper' ]
    })

    await service(3006, 'cookbooks', 'patch', {
        add: [ 'deleteHelperCookbook' ]
    })

    await service(3006, 'recipes', 'patch', {
        add: [ 'deleteHelperRecipe' ]
    })

    let result = {};

    result.previousRecipeRefs = (await service(3005, 'metadata?id=deleteHelperRecipe', 'get')).body.metadata.references
    result.previousCookbookRefs = (await service(3003, '?id=deleteHelperCookbook', 'get')).body.cookbook.references
    result.previousFollowing = (await service(3006, '?username=delete', 'get')).body.user.following
    result.previousFollowers = (await service(3006, '?username=deleteHelper', 'get')).body.user.followers

    await service(3002, 'delete', 'post', {
        username:'delete',
        password:'pd'
    })

    result.currentRecipeRefs = (await service(3005, 'metadata?id=deleteHelperRecipe', 'get')).body.metadata.references
    result.currentCookbookRefs = (await service(3003, '?id=deleteHelperCookbook', 'get')).body.cookbook.references
    result.currentFollowers = (await service(3006, '?username=deleteHelper', 'get')).body.user.followers
    
    return result;
}, 
    Expression.Check(x => x.previousRecipeRefs == x.currentRecipeRefs + 1),
    Expression.Check(x => x.previousCookbookRefs == x.currentCookbookRefs + 1),
    Expression.Check(x => JSON.stringify(x.previousFollowing) == JSON.stringify(['deleteHelper'])),
    Expression.Check(x => x.previousFollowers == x.currentFollowers + 1)
);