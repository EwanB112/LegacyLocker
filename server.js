const express = require('express')
const app = express()

app.get("/", (req, res) => {
    console.log("here")
})
const port = process.env.port || 3000;
app.listen(port, () =>{
    console.log('woo');
})
