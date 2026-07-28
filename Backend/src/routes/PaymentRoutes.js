const express = require("express");
const router = express.Router();
const { getPayments, addPayment, updatePaymentStatus } = require("../controllers/payment");

router.get("/all", getPayments);
router.post("/add", addPayment);
router.put("/status/:payment_id", updatePaymentStatus);

module.exports = router;