const { Test, Status, Body, Headers } = require('../tests');
const service = require('../fetch');

new Test('Metadata -> Missing id', async () => {
    await service(3002, 'logout', 'post')

    return await service(3005, 'metadata', 'get')
}, Status.Is(400));


new Test('Metadata -> No recipe', async () => {
    await service(3002, 'logout', 'post')

    return await service(3005, 'metadata?id=123', 'get')
}, Status.Is(404));

new Test('Metadata -> Success', async () => {
    

    await service(3002, 'register', 'post', {
        username:'metadata',
        email:'metadata@mail.com',
        password:'pd'
    })



    await service(3005, '', 'post', {
        id: 'metadataTest',
        data: {
            title: 'test',
            text: 'test recipe'
        }
    })

    return await service(3005, 'metadata?id=metadataTest', 'get');
}, Status.Is(200), Body.HasProperties(['metadata.owner', 'metadata.versions', 'metadata.latest']), Body.HasValue('metadata.owner','metadata'));