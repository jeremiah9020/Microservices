const { Test, Status, Body, Headers, Expression } = require('../tests');
const {service} = require('../fetch');

new Test('Cookbook -> Copy -> Unauthorized', async () => {
    await service(3002, 'logout', 'post')

    return await service(3003, 'copy', 'post', {
        id: 'testingCookbook'
    })
}, Status.Is(401))

new Test('Cookbook -> Copy -> Missing id', async () => {
    await service(3002, 'register', 'post', {
        username: 'copy',
        email: 'copy@mail.com',
        password: 'pd'
    })

    return await service(3003, 'copy', 'post', {})
}, Status.Is(400))


let newId;
new Test('Cookbook -> Copy -> Success', async () => {
    await service(3002, 'register', 'post', {
        username: 'copy',
        email: 'copy@mail.com',
        password: 'pd'
    })



    const result = await service(3003, 'copy', 'post', {
        id: 'testingCookbook'
    })

    newId = result.body.id;


    const result2 = await service(3003, `?id=${result.body.id}`, 'get')

    
    result.is_a_copy = result2.body.cookbook?.is_a_copy;

    const result3 = await service(3003, '?id=testingCookbook', 'get')


    result.times_copied = result3.body.cookbook?.times_copied;


    return result;
}, Status.Is(200), Expression.Check(newCookbook => newCookbook.is_a_copy),  Expression.Check(original => original.times_copied == 1));

new Test('Cookbook -> Copy -> Unauthorized', async () => {
    await service(3003, '', 'patch', {
        id: newId,
        visibility: 'private'
    })

    await service(3002, 'register', 'post', {
        username: 'copy2',
        email: 'copy2@mail.com',
        password: 'pd'
    })

    const result = await service(3003, 'copy', 'post', {
        id: newId
    })

    return result
}, Status.Is(403));