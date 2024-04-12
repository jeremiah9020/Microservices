const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Define the port
const port = 3105

// Load the protobuf definitions
const recipePath = path.join(__dirname, './protobufs/recipe.proto');
const { recipe } = grpc.loadPackageDefinition(protoLoader.loadSync(recipePath))

// Initiate the clients
const recipeClient = new recipe.Recipe(`localhost:${port}`, grpc.credentials.createInsecure());

/**
 * Increments a recipe's reference count
 * @param {string} id 
 * @returns {Promise<null>}
 */
async function increment(id) {
    return new Promise((resolve, reject) => {
        recipeClient.increment({ id }, (error, _) => {
            if (error) {
                return reject('Error in RecipeClient increment');
            } else {
                return resolve();
            }
        })
    })   
}

/**
 * Decrements a recipe's reference count
 * @param {string} id 
 * @returns {Promise<null>}
 */
async function decrement(id) {
    return new Promise((resolve, reject) => {
        recipeClient.decrement({ id }, (error, _) => {
            if (error) {
                return reject('Error in RecipeClient decrement');
            } else {
                return resolve();
            }
        })
    })   
}

/**
 * Gets a recipe feed
 * @param {number} items 
 * @param {number} set 
 * @param {number} query 
 * @returns {Promise<Array<string>>}
 */
async function getFeed(items = 50, set = 1, query = undefined) {
    return new Promise((resolve, reject) => {
        recipeClient.getFeed({ items, set, query }, (error, { recipes }) => {
            if (error) {
                return reject('Error in RecipeClient getFeed');
            } else {
                return resolve(recipes);
            }
        })
    })   
}

module.exports = { port, def: recipe, services: { increment, decrement, getFeed } }