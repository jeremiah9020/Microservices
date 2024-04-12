const secretsClient = require('./utils/secretsClient')
const { getLocalDatabase, getProductionDatabase, isDatabaseConnected} = require('./utils/database')
const { getRoleNumber, getRoleObject } = require('./utils/roles')
const { loosely, strictly, server } = require('./utils/middleware/authenticate')
const env = require('./utils/env')
const grpc = require('./grpc/grpc')

module.exports = { 
    grpc,
    authenticate: {
        loosely,
        strictly,
        server
    },
    env, 
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