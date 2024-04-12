const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf definitions
const recipePath = path.join(__dirname, './protobufs/recipe.proto');
const { recipe } = grpc.loadPackageDefinition(protoLoader.loadSync(recipePath))

// Initiate the clients
const recipeClient = new recipe.Recipe('localhost:3105', grpc.credentials.createInsecure());

module.exports = { def: recipe, services: { } }