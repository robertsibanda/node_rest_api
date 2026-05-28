/**
 * Database connection module.
 * @module db/connect
 */

const mongoose = require('mongoose');

const connectionString  = "mongodb://127.0.0.1:27017/TaskManager";

/**
 * Connects to MongoDB.
 * @param {string} [url] - MongoDB connection string.
 * @returns {Promise<void>}
 */
const connectDB = (url) => {
    mongoose.set('strictQuery', false)
    return mongoose
            .connect(url)
            .then(() => console.log("CONNECTED TO DB"))
            .catch((err) => console.log(err))
}


module.exports = connectDB;

