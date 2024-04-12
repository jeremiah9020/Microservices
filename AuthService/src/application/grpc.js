const { grpc: { def: { auth: authDef } } } = require('shared');
const grpc = require('@grpc/grpc-js')
const sequelize = require('../database/db');


async function getRole(call, callback) {
    const { username } = call.request;

    const db = await sequelize;

    const user = await db.models.auth.findOne({ where: { username }});

    let role = 0;
    if (user) {
        role = user.role;
    }

    return callback(null, { role });

}

async function getTimeout(call, callback) {
    const { username } = call.request;

    const db = await sequelize;
    
    const user = await db.models.auth.findByPk(username);

    let timeout = 0;
    if (user) {
        timeout = user.timeout_until;
    }

    return callback(null, { timeout });
}

/**
 * Starts the gRPC server
 * @param {number} port 
 */
function startGRPC(port) {   
    // gRPC server setup
    const grpcServer = new grpc.Server();
    grpcServer.addService(authDef.Auth.service, { getRole, getTimeout });
    grpcServer.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure() , () => {});
}

module.exports = { startGRPC }

