const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const services = {};
const servicesPath = path.resolve(__dirname, '../services');
const serviceFiles = fs.readdirSync(servicesPath);
for (const service of serviceFiles) {
    const servicePort = fs.readFileSync(servicesPath + '/' + service).toString()
    services[service] = {
        local: `http://127.0.0.1:${servicePort.trim()}`, online: `https://${service}.happyfield-2bbfce7e.westus.azurecontainerapps.io`
    }
}

/**
 * Make a request to a different service
 * @param {String} service 
 * @param {fetch.RequestInit | undefined} [init]
 * @returns {fetch.Response}
 */
async function serviceRequest(service, path, init) {
    const urlType = (process.env.ONLINE) ? 'online' : 'local';
    const url = services[service][urlType] + path;
    return await fetch(url, init);
}

module.exports = serviceRequest;