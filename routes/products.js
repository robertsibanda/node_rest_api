const router = require("express").Router();

const { updateProduct, getProduct, getAllProducts, deleteProdut, createProduct } = require("../controllers/products");

router.route("/").get(getAllProducts).post(createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProdut);


module.exports = router 