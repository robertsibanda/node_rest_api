/**
 * 404 Not Found middleware.
 * @module middleware/not-found
 */

/**
 * Middleware that returns a 404 response for unknown routes.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void}
 */
const NotFound = (req, res) => res.status(404).json({error : "Route not found"})
module.exports = NotFound;