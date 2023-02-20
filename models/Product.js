const mongoose  = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productid : {
    },

    productname : {
    },

    productprice : {
    },

    description : {
    },

    others  :{
        quantity : {
        },
    }

});

module.exports = mongoose.model("Product", ProductSchema);