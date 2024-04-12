const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { getRoleObject } = require('../utils/roles')

// Get the file paths
const authPath = path.join(__dirname, './protobufs/auth.proto');
const cookbookPath = path.join(__dirname, './protobufs/cookbook.proto');
const recipePath = path.join(__dirname, './protobufs/recipe.proto');
const userPath = path.join(__dirname, './protobufs/user.proto');

// Load Protobuf definition
const { auth } = grpc.loadPackageDefinition(protoLoader.loadSync(authPath))
const { cookbook } = grpc.loadPackageDefinition(protoLoader.loadSync(cookbookPath))
const { recipe } = grpc.loadPackageDefinition(protoLoader.loadSync(recipePath))
const { user } = grpc.loadPackageDefinition(protoLoader.loadSync(userPath))

// Initiate the clients
const authClient = new auth.Auth('localhost:3102', grpc.credentials.createInsecure());
const cookbookClient = new cookbook.Cookbook('localhost:3103', grpc.credentials.createInsecure());
const recipeClient = new recipe.Recipe('localhost:3105', grpc.credentials.createInsecure());
const userClient = new user.User('localhost:3106', grpc.credentials.createInsecure());

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

module.exports = {
    auth: {
        getRole,
        getTimeout
    },
    def: {
        auth,
        cookbook,
        recipe,
        user
    }
}