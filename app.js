/**
 * Application entry point.
 * @module app
 */

require('express-async-errors');
const connectDB = require("./db/connect");
const express = require('express');

const CourseRouter = require('./routes/coursesRoutes');
const NotFound = require("./middleware/not-found");

const Mainrouter = require('./routes/mainRoutes');
const app = express();

//middleware
app.use(express.json());
app.use(express.static('./public'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//routes
app.use('/api/v1/courses', CourseRouter);
app.use('/api/v1/', Mainrouter);

app.use(NotFound);

/**
 * Starts the Express server.
 * Connects to the database first, then listens on port 3000.
 * @returns {Promise<void>}
 */
const start = async () => {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log('server running @ 3000');
        });
    } catch (error) {
        console.log(error);
    }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}
module.exports = app;
