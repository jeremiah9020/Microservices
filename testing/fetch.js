const fetch = require('node-fetch');
const { serviceRequest } = require('shared');

let access_token;

async function service(port, path, method, body) {
    const request = { 
        method: method,
        headers: {}
    }

    if (body) {
        request.headers['Content-Type'] = 'application/json';
        request.body = JSON.stringify(body)
    }

    if (access_token) {
        request.headers['Authorization'] = access_token
    }

    const response = await fetch(`http://localhost:${port}/${path}`, request)

    const ret = {status: response.status, headers:response.headers}

    if (response.headers.get('set-cookie')) {
        const setCookie = response.headers.get('set-cookie');
        const [_,token] = setCookie.split('=');
        access_token = token.split(';')[0];
    }

    try {
        const json = await response.json();
        ret.body = json;

        if (json.access_token) {
            access_token = json.access_token;
        }
    } catch (err) {}

    return ret;
}

async function server(name, path, method, body) {
    const response = await serviceRequest(name, path, { method }, body)

    let retBody = {}
    try {
        retBody = await response.json()
    } catch (err) {}

    return {status: response.status, headers:response.headers, body: retBody}
}

module.exports = {
    service,
    server
}