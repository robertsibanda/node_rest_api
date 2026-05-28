/**
 * Main authentication and user routes.
 * @module routes/mainRoutes
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Token = require("../models/tokens");

const Users = require('../models/users');

const bcrypt = require("bcrypt");

const authenticationMiddleware = require("../middleware/auth");

const JWT_SECRET = 'jwtSecret';
const REFRESH_TOKEN = 'jwtsecret3';

/**
 * Registers a new user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "please provide email and password" });

  const userexists = await Users.findOne({ username: username })

    .then(async (user) => {

      if (user) return res.json({ error: "User already exists" });
      const hashdPassword = await bcrypt.hash(password, 10);
      await Users.create({ "username": username, "password": hashdPassword })
        .then(() => res.status(200).json({ message: `user created ${username}` }))
    })
    .catch(err => {
      res.json({ failed: err.message });
    })

}

/**
 * Authenticates a user and returns JWT tokens.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ error: "please provide email and password" });

  await Users.findOne({ username: username })

    .then(async (user) => {
      if (!user) return res.status(400).json({ error: "user not found" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.json({ error: "Wrong credenatisls" });
      return user;
    })
    .then(async (user) => await GenerteToken(req, res, user, username))
    .catch((error) => res.json({ failed: error }));


}

/**
 * Generates JWT access and refresh tokens for a user.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {Object} user - User document from the database.
 * @param {string} username - Username string.
 * @returns {Promise<void>}
 */
const GenerteToken = async (req, res, user, username) => {

  const { id, admin, staff } = user;
  const token = await jwt.sign({ id, username, admin, staff }, JWT_SECRET, {
    expiresIn: "1d",
  });

  const NrefreshToken = await jwt.sign({ id, username, admin, staff },
    REFRESH_TOKEN,
    {
      expiresIn: "30d",
    }
  );

  await Token.findOne({ user: id })
    .then(async (existingToken) => {
      if (!existingToken) {
        await Token.create({
          user: id,
          token: NrefreshToken,
        });
      } else {
        await Token.findOneAndUpdate(
          { user: id },
          { token: NrefreshToken }
        );
      }
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

/**
 * Returns a dashboard message with a random lucky number.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {void}
 */
const dashboard = async (req, res, next) => {

  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({ msg: `${req.user.username}`, secret: `Here is your luck number ${luckyNumber}` });

}

/**
 * Refreshes an expired access token using a valid refresh token.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const refreshToken = async (req, res) => {

  const { token } = req.body;

  if (!token) return res.status(401).json({ error: "No token supplied" });

  await jwt.verify(token, REFRESH_TOKEN, async (error, data) => {
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
        res.status(200).json({ message: error })
      });


  });
}



router.route('/signup')
  .post(signup);

router.route('/dashboard')
  .get(authenticationMiddleware, dashboard);

router.route('/login')
  .post(login);

router.route('/token')
  .post(refreshToken)

module.exports = router;
