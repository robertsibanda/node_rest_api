const notFound = (req, res)=> {
    //console.log(req);
    res.status(404).send("Route not found");
}

module.exports = notFound;