const jwt = require('jsonwebtoken');

// TODO: move secrets to env variables
const JWT_SECRET = 'jwtSecret';
const REFRESH_TOKEN = 'jwtsecret3';

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer"))
    return res.status(401).json({ error: "invalid token .. login again" });


  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error)
      return res.status(401).json({
        error1: "not authorized to access this route",
        errormessage: error.message,
      });

    const { id, username, admin, staff } = decoded;

    req.user = { id, username, admin, staff };
    console.log(req.user);
    next();
  });

}

module.exports = authenticationMiddleware;