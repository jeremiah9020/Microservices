const jwt = require('jsonwebtoken');
const env = require('../env');

const loosely = (req, res, next) => {
    const headerToken = req.header('Authorization');
    const cookieToken = req.cookies.ACCESSTOKEN;
    const token = headerToken || cookieToken;

    try {
        const decoded = jwt.verify(token, env.SECRET_KEY);
        req.username = decoded.username;
        next();
    } catch (error) {
        next();
    }
};

const strictly = (req, res, next) => {
    const headerToken = req.header('Authorization');
    const cookieToken = req.cookies.ACCESSTOKEN;

    if (!(headerToken || cookieToken)) {
        return res.status(401).json({ error: 'lacking authorization required for request.' });
    }

    const token = headerToken || cookieToken;

    try {
        const decoded = jwt.verify(token, env.SECRET_KEY);
        req.username = decoded.username;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'lacking authorization required for request.' });
    }
};

module.exports = { loosely, strictly };