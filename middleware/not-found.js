const NotFound = (req, res) => res.status(400).json({error : "Route not found"})
module.exports = NotFound;