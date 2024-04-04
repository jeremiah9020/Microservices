const { Test, Status, Body, Headers, Expression } = require('../tests');
const {service} = require('../fetch');

new Test('Feed -> Home', async () => {
    await service(3002, 'register', 'post', {
        username: 'feed',
        email: 'feed@mail.com',
        password: 'pd'
    })

    for (let i = 0; i < 100; i++) {
        await service(3005, '', 'post', {
            data: {
                text: `This is recipe ${i}`,
                title: `recipe${i}`
            }
        })
    } 
  
    return await service(3004, 'home', 'get')
}, Status.Is(200), Body.HasProperty('recipes'), Expression.Check(x => x.body.recipes.length == 50))