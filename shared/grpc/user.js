const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Define the port
const port = 3106

// Load the protobuf definitions
const userPath = path.join(__dirname, './protobufs/user.proto');
const { user } = grpc.loadPackageDefinition(protoLoader.loadSync(userPath))

// Initiate the clients
const userClient = new user.User(`localhost:${port}`, grpc.credentials.createInsecure());

/**
 * Updates a users cookbooks list
 * @param {string} username 
 * @param {Array<string>} add 
 * @param {Array<string>} remove 
 * @returns {Promise<null>}
 */
async function updateCookbooks(username, add, remove) {
    return new Promise((resolve, reject) => {
        userClient.updateCookbooks({ username, add, remove }, (error, _) => {
            if (error) {
                return reject('Error in UserClient updateCookbooks');
            } else {
                return resolve();
            }
        })
    })   
}
   
/**
 * Updates a users recipe list
 * @param {string} username 
 * @param {Array<string>} add 
 * @param {Array<string>} remove 
 * @returns {Promise<null>}
 */
async function updateRecipes(username, add, remove) {
    return new Promise((resolve, reject) => {
        userClient.updateRecipes({ username, add, remove }, (error, _) => {
            if (error) {
                return reject('Error in UserClient updateRecipes');
            } else {
                return resolve();
            }
        })
    })   
}

/**
 * Deletes a user under the user service
 * @param {string} username 
 * @returns {Promise<null>}
 */
async function deleteUser(username) {
    return new Promise((resolve, reject) => {
        userClient.delete({ username }, (error, _) => {
            if (error) {
                return reject('Error in UserClient delete');
            } else {
                return resolve();
            }
        })
    })   
}

/**
 * Creates a user under the user service
 * @param {string} username 
 * @returns {Promise<null>}
 */
async function create(username) {
    return new Promise((resolve, reject) => {
        userClient.create({ username }, (error, _) => {
            if (error) {
                return reject('Error in UserClient create');
            } else {
                return resolve();
            }
        })
    })   
}

/**
 * Gets a user feed
 * @param {number} items 
 * @param {number} set 
 * @param {number} query 
 * @returns {Promise<Array<string>>}
 */
async function getFeed(items, set, query) {
    return new Promise((resolve, reject) => {
        userClient.getFeed({ items, set, query }, (error, { users }) => {
            if (error) {
                return reject('Error in UserClient getFeed');
            } else {
                return resolve(users || []);
            }
        })
    })   
}

module.exports = { port, def: user, services: { updateRecipes, updateCookbooks, delete: deleteUser, create, getFeed } }