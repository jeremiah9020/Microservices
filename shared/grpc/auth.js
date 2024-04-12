const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { getRoleObject } = require('../utils/roles')

// Define the port
const port = 3102

// Load the protobuf definitions
const authPath = path.join(__dirname, './protobufs/auth.proto');
const { auth } = grpc.loadPackageDefinition(protoLoader.loadSync(authPath))

// Initiate the clients
const authClient = new auth.Auth(`localhost:${port}`, grpc.credentials.createInsecure());

/**
 * Gets a user's role
 * @param {string} username  
 * @returns {import('../utils/roles').RoleObject}
 */
async function getRole(username) {
    return new Promise((resolve, reject) => {
        authClient.getRole({ username }, (error, { role }) => {
            if (error) {
                return reject('Error in AuthClient getRole');
            } else {
                return resolve(getRoleObject(role));
            }
        })
    })   
}

/**
 * Gets a user's timeout
 * @param {string} username 
 * @returns 
 */
async function getTimeout(username) {
    return new Promise((resolve, reject) => {
        authClient.getTimeout({ username }, (error, { timeout }) => {
            if (error) {
                return reject('Error in AuthClient getTimeout');
            } else {
                return resolve(timeout.toNumber());
            }
        })
    })   
}

module.exports = { port, def: auth, services: { getRole, getTimeout } }