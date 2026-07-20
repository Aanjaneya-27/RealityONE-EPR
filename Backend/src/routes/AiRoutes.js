const express = require("express");
const router = express.Router();
const { getAIResponse } = require("../controllers/AiController");

router.post("/ask", getAIResponse);

module.exports = router;