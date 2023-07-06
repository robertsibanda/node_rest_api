const mongoose = require("mongoose");
const topic = require("./topic");
const user = require('./users')

courseSchema = new mongoose.Schema({
    name :  {
        type : String,
        required :  [true, 'Course name is required'],
        maxlength : 200
    },

    topics : [
        
    ],

    instructor : {

    }

});

module.exports = mongoose.model('Course', courseSchema);