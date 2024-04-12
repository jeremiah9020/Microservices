const { grpc: { def: { cookbook: cookbookDef } } } = require('shared');
const grpc = require('@grpc/grpc-js')
const sequelize = require('../database/db');

async function updateCookbooks(call, callback) {
    const { username, add, remove } = call.request;

    // Update the user's cookbooks

    return callback(null, {});
}

async function updateRecipes(call, callback) {
    const { username, add, remove } = call.request;

    // Update the user's recipes

    return callback(null, { });
}

async function deleteUser(call, callback) {
    const { username } = call.request;

    // Delete the user;

    return callback(null, {});
}

async function create(call, callback) {
    const { username } = call.request;

    // Create the user;

    return callback(null, {});
}

async function getFeed(call, callback) {
    const { items, set, query } = call.request;

    // Get users feed;
    const users = []

    return callback(null, { users });
}

/**
 * Starts the gRPC server
 * @param {number} port 
 */
function startGRPC(port) {   
    // gRPC server setup
    const grpcServer = new grpc.Server();
    grpcServer.addService(cookbookDef.Cookbook.service, { updateCookbooks, updateRecipes, delete: deleteUser, create, getFeed });
    grpcServer.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure() , () => {});
}

module.exports = { startGRPC }

