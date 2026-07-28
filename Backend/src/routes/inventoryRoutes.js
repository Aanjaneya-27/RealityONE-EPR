const express = require("express");
const router = express.Router();
const { getInventory, quickBookUnit } = require("../controllers/inventory");

router.get("/all", getInventory);
router.put("/book/:unit_id", quickBookUnit); 

module.exports = router;