/**
 * Authentication middleware.
 * @module middleware/auth
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = 'jwtSecret';
const REFRESH_TOKEN = 'jwtsecret3';

/**
 * Middleware that verifies the JWT Bearer token from the Authorization header.
 * Attaches decoded user payload to `req.user`.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void}
 */
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