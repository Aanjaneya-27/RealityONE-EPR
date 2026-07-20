require('dotenv').config()
const app = require('./src/app')
require('./src/config/database')




app.listen(5000, () => {
   console.log("Server is Running on port");
   
})