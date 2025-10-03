const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");
const authCustomer = require("../middleware/authCustomer");

router.post("/create", authCustomer, createOrder); // only signed-in users
module.exports = router;
