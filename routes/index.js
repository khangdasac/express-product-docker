const Router = require('express').Router;
const router = Router();
const productRoute = require("./product.route");

router.use("/products", productRoute);

module.exports = router;