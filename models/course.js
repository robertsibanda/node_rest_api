/**
 * Course model.
 * @module models/course
 */

const mongoose = require("mongoose");

/** @type {mongoose.Schema} */
const courseSchema = new mongoose.Schema({
    name :  {
        type : String,
        required :  [true, 'Course name is required'],
        maxlength : 200
    },

    topics : [
        
    ],

    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    }

});

module.exports = mongoose.model('Course', courseSchema);