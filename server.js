const express = require('express')
const app = express()
const mysql = require('mysql');
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
let j;
let IPFSFile;

const db = mysql.createConnection({
    host: "database-1.cstenthch6dd.eu-west-2.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "Northleach",
    database: "LegacyLocker",
})
db.connect(function (err) {
    if (err) throw err;
    db.query("SELECT * FROM accounts", function (err, result, fields) {
        if (err) throw err;
        j = result
        console.log(result);
    });
});
//secret 
// Use this code snippet in your app. p
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html

/*
db.query(`
    CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    IPFSData varchar(255)
  )
`);

/*
db.query(`
INSERT INTO accounts (IPFSData)
VALUES ('https://animus.infura-ipfs.io/ipfs/QmNsZtA4aLSZXBtmFkL8w43eTTe7TBWpGJMniP9gymy8Xr');
`);

/*
db.query(`

`);
*/
/*
db.query(`
DELETE FROM accounts WHERE id='3';
`);
https://animus.infura-ipfs.io/ipfs/QmeRocpGoDnASGSZDwHmmEDCJEVnYpufbfzv3siRUwqtCm
*/
/*
db.query(`
INSERT INTO accounts (IPFSData)
VALUES ('https://animus.infura-ipfs.io/ipfs/QmeRocpGoDnASGSZDwHmmEDCJEVnYpufbfzv3siRUwqtCm');
`);

db.query(`
DROP TABLE accounts;
`);
*/



app.get("/", (req, res) => {
    console.log("here")
    res.json(j)
    console.log(j)
})

app.post('/', (req, res) => {
    console.log(req.body.key)
    IPFSFile = req.body.key
    db.query(`
    INSERT INTO accounts (IPFSData)
    VALUES ('${IPFSFile}')
    `)
    res.send({ success: true })
});

app.listen(3000)
