const serviceBridge = require('./utils/serviceBridge')
const secretsClient = require('./utils/secretsClient')
const { getLocalDatabase, getProductionDatabase, isDatabaseConnected} = require('./utils/database')
const { getRoleNumber, getRoleObject } = require('./utils/roles')

module.exports = { 
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