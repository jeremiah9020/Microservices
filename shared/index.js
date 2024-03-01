const serviceBridge = require('./utils/serviceBridge')
const secretsClient = require('./utils/secretsClient')
const { getLocalDatabase, getProductionDatabase, isDatabaseConnected} = require('./utils/database')
module.exports = { serviceBridge, secretsClient, database: { getLocalDatabase, getProductionDatabase, isDatabaseConnected }}