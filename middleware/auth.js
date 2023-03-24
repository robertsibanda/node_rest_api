const jwt = require('jsonwebtoken');
const Users = require('../db/users');


JWT_SECRET     ='jwtSecret';
ACCESS_TOKEN   ='jwtSecret2';
REFRESH_TOKEN  ='jwtsecret3';


class CustomAuthenticationError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
    }
}


const authenticationMiddleware  = async(req, res, next) =>{
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer"))
      return res.status(401).json({ error: "invalid token .. login again" });


    const token = authHeader.split(" ")[1];
    
    const decodFunc = jwt.verify(token, JWT_SECRET, async (error, decoded) => {
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