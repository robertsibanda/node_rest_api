/**
 * Topic model.
 * @module models/topic
 */

const mongoose = require("mongoose");

/** @type {mongoose.Schema} */
const TopicSchema = new mongoose.Schema({
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Course'
    },
    id : String, 
    name : {
        type : String,
        required : [true, 'topic name is required'],
        maxlength : 200
    },

    description : {
        type : String, 
        default : 'Topic Description'
    },

    marks : {
        type : Number,
        default: 0
    },

    medialinks  : {
        type : Object,
        default : []
    },

    price : {
        type : Number,
        default : 0
    }
});

module.exports = mongoose.model('Topic', TopicSchema);