const express = require('express');
const cors = require('cors');
const leadRoutes = require("./routes/leadRoutes")
const AiRoutes = require('./routes/AiRoutes')


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/userRoutes'))
app.use('/api/leads', leadRoutes)
app.use('/api/ai', AiRoutes)


module.exports = app;