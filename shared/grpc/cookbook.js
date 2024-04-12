const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Define the port
const port = 3103

// Load the protobuf definitions
const cookbookPath = path.join(__dirname, './protobufs/cookbook.proto');
const { cookbook } = grpc.loadPackageDefinition(protoLoader.loadSync(cookbookPath))

// Initiate the clients
const cookbookClient = new cookbook.Cookbook(`localhost:${port}`, grpc.credentials.createInsecure());

/**
 * Creates a cookbook for a user with an optional title.
 * @param {string} username 
 * @param {string} title 
 * @returns {Promise<null>}
 */
async function create(username, title = undefined) {
    return new Promise((resolve, reject) => {
        cookbookClient.create({ username, title }, (error, _) => {
            if (error) {
                return reject('Error in CookbookClient create');
            } else {
                return resolve();
            }
        })
    })   
}

/**
 * Gets a cookbook feed
 * @param {number} items 
 * @param {number} set 
 * @param {number} query 
 * @returns {Promise<Array<string>>}
 */
async function getFeed(items = 50, set = 1, query = undefined) {
    return new Promise((resolve, reject) => {
        cookbookClient.getFeed({ items, set, query }, (error, { cookbooks }) => {
            if (error) {
                return reject('Error in CookbookClient getFeed');
            } else {
                return resolve(cookbooks);
            }
        })
    })   
}

/**
 * Increments a cookbook's reference count
 * @param {string} id 
 * @returns {Promise<null>}
 */
async function increment(id) {
    return new Promise((resolve, reject) => {
        cookbookClient.increment({ id }, (error, _) => {
            if (error) {
                return reject('Error in CookbookClient increment');
            } else {
                return resolve();
            }
        })
    })   
}

/**
 * Decrements a cookbook's reference count
 * @param {string} id 
 * @returns {Promise<null>}
 */
async function decrement(id) {
    return new Promise((resolve, reject) => {
        cookbookClient.decrement({ id }, (error, _) => {
            if (error) {
                return reject('Error in CookbookClient decrement');
            } else {
                return resolve();
            }
        })
    })   
}

module.exports = { port, def: cookbook, services: { create, getFeed, increment, decrement } }