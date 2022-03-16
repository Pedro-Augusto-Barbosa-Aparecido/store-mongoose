const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: "No token Provide!" });

    }

    const parts = authHeader.split(" ");

    if (!parts.length === 2) {
        return res.status(401).send({ error: "Token ERROR" });

    }

    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: "Token not formatted" });

    }

    jwt.verify(token, authConfig.secret, (err, decode) => {
        if (err) return res.status(401).send({ error: "Token invalid!" });

        req.userId = decode.id;
        return next();

    });

}
