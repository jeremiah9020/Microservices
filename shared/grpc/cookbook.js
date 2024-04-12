const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf definitions
const cookbookPath = path.join(__dirname, './protobufs/cookbook.proto');
const { cookbook } = grpc.loadPackageDefinition(protoLoader.loadSync(cookbookPath))

// Initiate the clients
const cookbookClient = new cookbook.Cookbook('localhost:3103', grpc.credentials.createInsecure());

module.exports = { def: cookbook, services: { } }