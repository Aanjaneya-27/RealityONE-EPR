const express = require('express');
const cors = require('cors');
const leadRoutes = require("./routes/leadRoutes")
const AiRoutes = require('./routes/AiRoutes')
const Customers = require('./routes/CustomerRoutes')


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/userRoutes'))
app.use('/api/leads', leadRoutes)
app.use('/api/ai', AiRoutes)
app.use('/api/customers', Customers)


module.exports = app;