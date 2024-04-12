const { grpc: { def: { cookbook: cookbookDef } } } = require('shared');
const grpc = require('@grpc/grpc-js')
const sequelize = require('../database/db');

async function create(call, callback) {
    const { username, title } = call.request;

    // create the cookbook

    return callback(null, {});
}

async function getFeed(call, callback) {
    const { items, set, query } = call.request;

    // Get recipe feed;
    const cookbooks = []

    return callback(null, { cookbooks });
}

async function decrement(call, callback) {
    const { id } = call.request;

    // Decrement cookbook count;

    return callback(null, {});
}

async function increment(call, callback) {
    const { id } = call.request;

    // Increment cookbook count;

    return callback(null, {});
}

/**
 * Starts the gRPC server
 * @param {number} port 
 */
function startGRPC(port) {   
    // gRPC server setup
    const grpcServer = new grpc.Server();
    grpcServer.addService(cookbookDef.Cookbook.service, { create, getFeed, increment, decrement });
    grpcServer.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure() , () => {});
}

module.exports = { startGRPC }

