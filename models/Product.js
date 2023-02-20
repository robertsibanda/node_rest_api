const mongoose  = require("mongoose");

const ProductSchema = new mongoose.Schema({
    productid : {
        //you can remove this property since mongodb has its own id _id
        type : String,
        require : [True, "product id is required"],
        max_length : 45,
        min_length : 20,
    },

    productname : {
        type : String,
        required : [True, "product name is required"],
    },

    productprice : {
        type : Double,
        required : [True, "price is required"],
    },

    description : {
        type : String,
    },

    others  :{
        //this is for other properties that you may want to keep in groups
        quantity : {
        },
    }

});

module.exports = mongoose.model("Product", ProductSchema);
