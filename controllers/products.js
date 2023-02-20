const Product = require("../models/Product");

const asyncWrapper = async (fn) => {
    //you can write an async warpper function to wrap all function 
    //to avoid repetition of the try-catch block
}

const getAllProducts = async (req, res) => {
    try{
        const data = await Product.find({});
        if (data) {
            res.status(200).json(data);
        }
        else{
            res.status(400).json({'msg' : 'no product found'});
        }
    }catch(error){
        res.json({'error ' : error.message})
    }
}

const getProduct = async (req, res) => {
    try{
        const product_id = req.params.id;

        const data = await Product.findOne({_id : product_id});
        if (!data) return res.status(404).json({"msg" : "no product found"});
        res.status(200).json(data);
    }catch(error){
        res.json({"error" : error.message});
    }
}

const deleteProdut = async (req, res) => {
    try{
        const product_id = req.params.id;
        const data = await Product.findOneAndDelete({_id : product_id});
        if (!data) return res.status(404).json({"msg" : "product not found"});
        res.status(200).json(data);
    }catch(error){
        res.json({"error" : error.message});
    }
}

const createProduct = async (req, res) => {
    try{
        const product_info = req.body;
        const product = await Product.create(product_info);
        res.status(200).json(Product);
    }catch(error){
        res.json({"error" : error.message});
    }
}

const updateProduct = async (req, res) => {
    try{
        const product_id = req.params.id;
     
        const product = await Task.findOneAndUpdate({_id:product_id}, req.body, {
            new : true,
            runValidators : true
        });
        if(!task){
            return res.status(400).json({error : `task ${product_id} not found`, data : null})
        }
        res.status(200).json(product);

    }catch(error){
        res.json({"error" : error.message});
    }
}
module.exports = { updateProduct, getProduct, getAllProducts, deleteProdut, createProduct }
