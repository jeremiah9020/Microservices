const { grpc: { def: { recipe: recipeDef } } } = require('shared');
const grpc = require('@grpc/grpc-js')
const sequelize = require('../database/db');

async function getFeed(call, callback) {
    const { items, set, query } = call.request;

    // Get recipe feed;
    const recipes = []

    return callback(null, { recipes });
}

async function decrement(call, callback) {
    const { id } = call.request;

    // Decrement recipe count;

    return callback(null, {});
}

async function increment(call, callback) {
    const { id } = call.request;

    // Increment recipe count;

    return callback(null, {});
}

/**
 * Starts the gRPC server
 * @param {number} port 
 */
function startGRPC(port) {   
    // gRPC server setup
    const grpcServer = new grpc.Server();
    grpcServer.addService(recipeDef.Recipe.service, { increment, decrement, getFeed });
    grpcServer.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure() , () => {});
}

module.exports = { startGRPC }

