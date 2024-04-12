const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf definitions
const userPath = path.join(__dirname, './protobufs/user.proto');
const { user } = grpc.loadPackageDefinition(protoLoader.loadSync(userPath))

// Initiate the clients
const userClient = new user.User('localhost:3106', grpc.credentials.createInsecure());

module.exports = { def: user, services: { } }