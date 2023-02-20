const express = require("express");
const productRouter  = require("./routes/products");
const notFound = require("./middleware/not-found");

require("./database/dbconnect");

const app = express();

app.use(express.json());

app.use("/api/product", productRouter);

app.use(notFound);

app.listen(3000, ()=>{
    console.log("server is listening @ 3000 ...");
})