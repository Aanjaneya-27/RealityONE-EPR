const express = require("express");
const router = express.Router();
const { createCustomer, getCustomers, updateCustomer, deleteCustomer } = require("../controllers/Customer");

router.post("/create", createCustomer);
router.get("/all", getCustomers);
router.post("/update", updateCustomer);
router.delete("/delete/:customer_id", deleteCustomer);

module.exports = router;