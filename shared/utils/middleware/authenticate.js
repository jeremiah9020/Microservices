const jwt = require('jsonwebtoken');
const env = require('../env');
const express = require('express')
const grpc = require('../../grpc/grpc');

async function checkTimedOut(username, res) {
    const timeout = await grpc.auth.getTimeout(username);

    if (timeout > Date.now()) {
        res.status(401).json({ error: 'you are timed out.' });
        return true;
    }
    
    return false;
}

/**
 * Tries to resolve either a user access token or a server access token
 * 
 * Will add username to req if there is a valid access token
 *  * 
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const loosely = (req, res, next) => {
    const headerToken = req.header('Authorization');
    const cookieToken = req.cookies.ACCESSTOKEN;

    try {
        const decoded = jwt.verify(headerToken, env.SECRET_KEY);
        req.username = decoded.username;
        return next();
    } catch (err) {
        try {
            const decoded = jwt.verify(cookieToken, env.SECRET_KEY);
            req.username = decoded.username;
            return next();
        } catch (err) {
            return next();
        }
    }
};

/**
 * Requires either a user access token or a server access token
 * 
 * Will return 401 if none are valid, or if the user has a timeout
 * 
 * Will add username to req if there is a valid access token
 * 
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const strictly = async (req, res, next) => {
    const headerToken = req.header('Authorization');
    const cookieToken = req.cookies.ACCESSTOKEN;

    if (!(headerToken || cookieToken)) {
        return res.status(401).json({ error: 'lacking authorization required for request.' });
    }

    
    try {
        const decoded = jwt.verify(headerToken, env.SECRET_KEY);

        const timedOut = await checkTimedOut(decoded.username, res);
        if (timedOut) return;

        req.username = decoded.username;
        return next();
    } catch (err) {
        try {
            const decoded = jwt.verify(cookieToken, env.SECRET_KEY);
            
            const timedOut = await checkTimedOut(decoded.username, res);
            if (timedOut) return; 

            req.username = decoded.username;
            return next();
        } catch (err) {
            return res.status(401).json({ error: 'lacking authorization required for request.' });
        }
    }
};

module.exports = { loosely, strictly };