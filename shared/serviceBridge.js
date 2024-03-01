const fetch = require('node-fetch');

/** @typedef {keyof services} Service */

const services = {
    service: {local: 'http://127.0.0.1:3000', online: 'https://service.happyfield-2bbfce7e.westus.azurecontainerapps.io'},
    service2: {local: 'http://127.0.0.1:3001', online: 'https://service2.happyfield-2bbfce7e.westus.azurecontainerapps.io'}
}

/**
 * Make a request to a different service
 * @param {Service} service 
 * @param {fetch.RequestInit | undefined} [init]
 * @returns {fetch.Response}
 */
async function serviceRequest(service, path, init) {
    const urlType = (process.env.ONLINE) ? 'online' : 'local';
    const url = services[service][urlType] + path;
    return await fetch(url, init);
}

module.exports = serviceRequest;