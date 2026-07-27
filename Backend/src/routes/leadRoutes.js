const express = require("express");
const router = express.Router();
const { createLead, getLeads, updateLead } = require("../controllers/leadController");

router.post("/create", createLead);
router.get("/all", getLeads);
router.put("/update/:id", updateLead)

module.exports = router;