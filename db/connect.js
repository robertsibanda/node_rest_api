const mongoose = require('mongoose');

const connectionString  = "mongodb://127.0.0.1:27017/TaskManager";

const connectDB = (url) => {
    mongoose.set('strictQuery', false)
    return mongoose
            .connect(connectionString)
            .then(() => console.log("CONNECTED TO DB"))
            .catch((err) => console.log(err))
}


module.exports = connectDB;

