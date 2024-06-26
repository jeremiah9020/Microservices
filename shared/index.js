const serviceRequest = require('./utils/serviceBridge')
const secretsClient = require('./utils/secretsClient')
const { getLocalDatabase, getProductionDatabase, isDatabaseConnected} = require('./utils/database')
const { getRoleNumber, getRoleObject } = require('./utils/roles')
const { loosely, strictly, server } = require('./utils/middleware/authenticate')
const env = require('./utils/env')

module.exports = { 
    authenticate: {
        loosely,
        strictly,
        server
    },
    env,
    serviceRequest, 
    secretsClient, 
    database: { 
        getLocalDatabase, 
        getProductionDatabase, 
        isDatabaseConnected 
    },
    role: {
        getRoleNumber,
        getRoleObject
    }
}