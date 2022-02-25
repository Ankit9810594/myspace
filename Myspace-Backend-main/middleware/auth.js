const jwt = require("jsonwebtoken");
//const config = require("config");


module.exports = function(req, res, next) {
    //if (!config.get("requiresAuth")) return next();
    if (!process.env.MYSPACE_API_REQUIRES_AUTH) return next();

    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        const decoded = jwt.verify(token, /*config.get("jwtPrivateKey")*/ process.env.MYSPACE_API_JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
};