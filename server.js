const express = require('express')
const app = express()
const mysql = require('mysql');
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())


const db = mysql.createConnection({
    host: "database-1.cstenthch6dd.eu-west-2.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "Northleach",
    database: "LegacyLocker",
})
db.connect(function (err) {
    if (err) throw err;
    console.log('connected')
});

app.get("/", (req, res) => {
    console.log("here")
})
const port = process.env.port || 3000;
app.listen(port, () =>{
    console.log('woo');
})
