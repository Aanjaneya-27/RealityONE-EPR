const express = require("express");
const router = express.Router();
const { createLead, getLeads } = require("../controllers/leadController");

router.post("/create", createLead);
router.get("/all", getLeads);

module.exports = router;