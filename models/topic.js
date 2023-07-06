const { string } = require("joi");
const mongoose = require("mongoose");
const course = require('./course')

TopicSchema = new mongoose.Schema({
    course ,
    id : String, 
    name : {
        type : String,
        required : [true, 'topic name is required'],
        maxlength : 200
    },

    description : {
        type : String, 
        default : 'Topic Description'
        //required : [true, 'description cannot be empty']
    },

    marks : {
        type : Number,
        default: 0
        //rqeuired : true,
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