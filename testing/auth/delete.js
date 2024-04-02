const { Test, Status, Body, Headers } = require('../tests');
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
        username:'delete',
        email:'delete@mail.com',
        password:'pd'
    })

    return await service(3002, 'delete', 'post', {
        username:'delete',
        password:'pd'
    })
}, Status.Is(200));