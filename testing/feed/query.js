const { Test, Status, Body, Headers, Expression } = require('../tests');
const {service} = require('../fetch');

new Test('Feed -> Query', async () => {
    for (let i = 0; i < 50; i++) {
        await service(3002, 'register', 'post', {
            username: `accountA${i}`,
            email: `accountA${i}@mail.com`,
            password: 'pd'
        })

        await service(3005, '', 'post', {
            visibility: 'private',
            data: {
                text: `This is recipe A${i} belonging to accountA${i}`,
                title: `recipeA${i}`
            }
        })

        await service(3002, 'register', 'post', {
            username: `accountB${i}`,
            email: `accountB${i}@mail.com`,
            password: 'pd'
        })

        await service(3005, '', 'post', {
            data: {
                text: `This is recipe B${i} belonging to accountB${i}`,
                title: `recipeB${i}`
            }
        })
    }
  
    return await service(3004, 'query?query=recipe B', 'get')
}, 
    Status.Is(200), 
    Body.HasProperties(['recipes','cookbooks','users']), 
    Expression.Check(x => x.body.recipes.length == 25), 
    Expression.Check(x => x.body.users.length == 0), 
    Expression.Check(x => x.body.cookbooks.length == 0)
);

new Test('Feed -> Query', async () => {
    return await service(3004, 'query?query=recipe A', 'get')
}, 
    Status.Is(200), 
    Body.HasProperties(['recipes','cookbooks','users']), 
    Expression.Check(x => x.body.recipes.length == 0), 
    Expression.Check(x => x.body.users.length == 0), 
    Expression.Check(x => x.body.cookbooks.length == 0)
);


new Test('Feed -> Query -> User', async () => {
    return await service(3004, 'query?query=accountA', 'get')
},
    Status.Is(200), 
    Body.HasProperties(['recipes','cookbooks','users']), 
    Expression.Check(x => x.body.recipes.length == 0), 
    Expression.Check(x => x.body.users.length == 12), 
    Expression.Check(x => x.body.cookbooks.length == 0)
);

new Test('Feed -> Query -> User', async () => {
    return await service(3004, 'query?query=accountB', 'get')
},
    Status.Is(200), 
    Body.HasProperties(['recipes','cookbooks','users']), 
    Expression.Check(x => x.body.recipes.length == 25), 
    Expression.Check(x => x.body.users.length == 12), 
    Expression.Check(x => x.body.cookbooks.length == 0)
);

new Test('Feed -> Query -> User with type', async () => {
    return await service(3004, 'query?type=user&query=account', 'get')
},
    Status.Is(200), 
    Body.HasProperties(['recipes','cookbooks','users']), 
    Expression.Check(x => x.body.recipes.length == 0), 
    Expression.Check(x => x.body.users.length == 50), 
    Expression.Check(x => x.body.cookbooks.length == 0)
);

new Test('Feed -> Query -> Cookbook', async () => {
    return await service(3004, 'query?query=default', 'get');
},
    Status.Is(200), 
    Body.HasProperties(['recipes','cookbooks','users']), 
    Expression.Check(x => x.body.recipes.length == 0), 
    Expression.Check(x => x.body.users.length == 0), 
    Expression.Check(x => x.body.cookbooks.length == 12)
);