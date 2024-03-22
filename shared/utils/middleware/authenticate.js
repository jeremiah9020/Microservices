const jwt = require('jsonwebtoken');
const env = require('../env');
const express = require('express')
const serviceRequest = require('../serviceBridge');

async function checkTimedOut(username, res) {
    const response = await serviceRequest('AuthService',`/timeout?username=${username}`);
    const timeout_until = await response.json().timeout_until;

    if (timeout_until > Date.now()) {
        res.status(401).json({ error: 'you are timed out.' });
        return true;
    }
    
    return false;
}

/**
 * Tries to resolve either a user access token or a server access token
 * 
 * Will add username to req if there is a valid access token
 * 
 * Will add fromServer to req if the server auth works
 * 
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

const loosely = (req, res, next) => {
    const headerToken = req.header('Authorization');
    const cookieToken = req.cookies.ACCESSTOKEN;
    const serverToken = req.header('ServerAuthorization');

    try {
        const decoded = jwt.verify(serverToken, env.SECRET_KEY);
        req.fromServer = decoded.fromServer;
        return next();
    } catch (err) {
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
    }
};

/**
 * Requires either a user access token or a server access token
 * 
 * Will return 401 if none are valid, or if the user has a timeout
 * 
 * Will add username to req if there is a valid access token
 * 
 * Will add fromServer to req if the server auth works
 * 
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const strictly = async (req, res, next) => {
    const headerToken = req.header('Authorization');
    const cookieToken = req.cookies.ACCESSTOKEN;
    const serverToken = req.header('ServerAuthorization');

    if (!(headerToken || cookieToken || serverToken)) {
        return res.status(401).json({ error: 'lacking authorization required for request.' });
    }

    try {
        const decoded = jwt.verify(serverToken, env.SECRET_KEY);
        req.fromServer = decoded.fromServer;
        return next();
    } catch (err) {
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
    }
};

/**
 * Requires either a server access token
 * 
 * Will return 401 if it is not valid or missing
 * 
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const server = (req, res, next) => {
    const headerToken = req.header('ServerAuthorization');
    try {
        jwt.verify(headerToken, env.SECRET_KEY);
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Incorrect or missing authorization' });
    }
}

module.exports = { loosely, strictly, server };