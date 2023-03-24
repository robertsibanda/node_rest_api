const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Token = require("../db/tokens");

//require data models
const Users = require('../db/users');
const course = require("../db/course")
const topic = require("../db/topic")
//end models

const bcrypt =require("bcrypt");

const authenticationMiddleware = require("../middleware/auth");
const users = require('../db/users');

JWT_SECRET     ='jwtSecret';
ACCESS_TOKEN   ='jwtSecret2';
REFRESH_TOKEN  ='jwtsecret3';


const signup = async (req, res) =>{
    const {username, password} =req.body;
    //
    if(!username || !password) return res.status(400).json({error : "please provide email and password"});

    //conflict on username
    const userexists = await Users.findOne({username : username})

        .then(async (user) => {

            if (user) return res.json({error : "User already exists"});
            const hashdPassword = await bcrypt.hash(password, 10);
            await Users.create({"username" : username,"password" : hashdPassword})
            .then(()=> res.status(200).json({message : `user created ${username}`}))
d
            
        })
        .catch(err =>{
            res.json({failed : error});
        })


    //create a hashed password to store in database
    
}

const login = async(req, res, next) =>{
        const { username, password } = req.body;

        //auth required both username and password from request body
        if (!username || !password)
          return res
            .status(400)
            .json({ error: "please provide email and password" });

        await Users.findOne({ username: username })
        
        //handle the data from the database
          .then(async (user) => {
            if (!user) return res.status(400).json({ error: "user not found" });

            //validate the password
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.json({ error: "Wrong credenatisls" });
            return user;
          })
          .then(async (user) => await GenerteToken(req, res, user, username))
          .catch((error) => res.json({ failed: error }));

   
}
const GenerteToken = async (req, res, user, username) => {

            const { id, admin, staff } = user;
            //const admin = true;
            const token = await jwt.sign({ id, username, admin, staff }, JWT_SECRET, {
              expiresIn: "1d",
            });

            const NrefreshToken = await jwt.sign({ id, username, admin, staff },
              REFRESH_TOKEN,
              {
                expiresIn: "30d",
              }
            );

            const TokenExists = await Token.findOne({ user: id })
              .then(async (token) => {
                if (!token)
                  savedToken = await Token.create({
                    user: id,
                    token: refreshToken,
                  });
                const savedToken = await Token.findOneAndUpdate(
                  { user: id },
                  { token: NrefreshToken }
                );
              })
              .then(() => {
                res.set("authorization", `Bearer ${token}`);
                res.set("REFRESH", `Bearer ${NrefreshToken}`);

                res
                  .status(200)
                  .json({ token: token, refreshToken: NrefreshToken });
              })
              .catch((error) => {
                res.status(402).json({ message: error });
                console.log(error);
              });

}
const dashboard = async (req, res, next) => {

    const luckyNumber = Math.floor(Math.random() * 100);
    res.status(200).json({msg : `${req.user.username}`,secret:`Here is your luck number ${luckyNumber}`});

}

const refreshToken = async(req, res) =>{

        const { token } = req.body;

        if (!token) return res.status(401).json({ error: "No token supplied" });

        const tokenVerified = await jwt.verify(token, REFRESH_TOKEN, async (error, data) => {
                if (error) res.status(401).json({ message: error })
                if (!data) return res.status(401).json({ error: "Invalid refresh token" });
                const { id, username, admin, staff } = data;
                await Token.findOne({ user: id, token: token })
                .then(async (tokenSaved) => {
                    if (!tokenSaved)
                        return res
                            .status(401)
                            .json({ error: "Token not found from database" });
                    if (tokenSaved.token != token) return res.status(401).json({ Error: "Invaid token" });
                    await GenerteToken(req, res, data, username);
                })
                .catch(error => {
                    //console.log(error)
                    res.status(200).json({ message: error })
                });
            

        });
}



router.route('/signup')
    .post(signup);

router.route('/dashboard')
    .get(authenticationMiddleware,dashboard);

router.route('/login')
    .post(login,GenerteToken);

router.route('/token')
    .post(refreshToken)

module.exports = router;
