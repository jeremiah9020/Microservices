const serviceBridge = require('./utils/serviceBridge')
const secretsClient = require('./utils/secretsClient')
const { getLocalDatabase, getProductionDatabase, isDatabaseConnected} = require('./utils/database')
const { getRoleNumber, getRoleObject } = require('./utils/roles')
const { loosely, strictly } = require('./utils/middleware/authenticate')
const env = require('./utils/env')

module.exports = { 
    authenticate: {
        loosely,
        strictly
    },
    env,
    serviceBridge, 
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