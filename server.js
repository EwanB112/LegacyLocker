const express = require('express')
const app = express()
const { PORT = 3000 } = process.env
const mysql = require('mysql')
const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
//const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const { get } = require('request')
require('dotenv').config();
let ACCESS_ID = process.env.ACCESS_ID;
let SECRET_KEY = process.env.SECRET_KEY;
const secretsManager = new AWS.SecretsManager({
    accessKeyId: ACCESS_ID,
    secretAccessKey: SECRET_KEY,
    region: 'eu-west-2'
});
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
    region: "eu-west-2"
});
let fName
let sName
let profileImage
let IPFSData;

const poolData = {
    UserPoolId: "eu-west-2_O7s9esC0Z", // Your user pool id here    
    ClientId: "7tv8171sa8tkofbau14h4a90k5" // Your client id here
};
const pool_region = 'eu-west-2';

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const db = mysql.createConnection({
    host: "database-1.cstenthch6dd.eu-west-2.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "Northleach",
    database: "LegacyLocker",
})

//db.connect(function (err) {
//   if (err) throw err;
//   console.log('Connected to db')
//});

app.get('/', (req, res) => {
    //res.send(j)
    //res.json(j)
    //console.log(j)
    db.query(`SELECT * FROM accounts`, function (err, result, fields) {
        if (err) throw err
        res.send(result)
        console.log(result)
    });
})

app.get('/signUp', (req, res) => {
    res.send('hello');
})

app.post('/signUp', (req, res) => {
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    //var register = RegisterUser(email,name,password);
    //res.send(`${register}`);
    RegisterUser(email, name, password)
        .then(returnedValue => {
            console.log(returnedValue)
            res.send(returnedValue)
        })
})

app.post('/verify', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var code = req.body.code;
    verifyConfirmationToken(`${email}`, `${password}`,`${code}`, "eu-west-2_O7s9esC0Z", "7tv8171sa8tkofbau14h4a90k5")
        .then(data => {
            console.log('Successfully verified token.');
            res.send('Successfully verified token.');
            console.log(data);
        })
        .catch(err => {
            console.log('Error verifying token.');
            console.log(err);
        });
})

app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    Login(email, password);
    res.send('whayyy');
})

app.post('/createS3Initial', (req,res) =>{
    var email = req.body.email;
    var password = req.body.password;
    creates3Initial(email,password);
})

app.post('/', (req, res) => {
    const value = req.body.value
    if (req.body.key == 'find account') {
        db.query(`SELECT * FROM accounts WHERE id = ${value}`, function (err, result, fields) {
            if (err) throw err
            res.json(result)
        });
    }

    if (req.body.key == 'upload') {
        fName = req.body.fName
        sName = req.body.sName
        profileImage = req.body.profileImage
        IPFSData = req.body.IPFSData
        db.query(`
        INSERT INTO accounts (fName,sName,profileImage,IPFSData)
        VALUES ('${fName}','${sName}','${profileImage}','${IPFSData}')
        `)
        db.query(`SELECT * FROM accounts`, function (err, result, fields) {
            if (err) throw err;
            res.send(result)
        });
    }
});

//storeSecrets('test3', 'AKIAXJO26ZLBOX37GNBT', 'j1qe4TyDL4EDRX2xJV1D7bY+7g9FGYpHgqfOl8pn');
/*
async function storeSecrets(username, accessKeyId, secretAccessKey) {
    AWS.config.update({
        region: 'eu-west-2',
        accessKeyId: ACCESS_ID,
        secretAccessKey: SECRET_KEY
    });
    const secretsManager = new AWS.SecretsManager({
        region: 'eu-west-2',
        accessKeyId: ACCESS_ID,
        secretAccessKey: SECRET_KEY
    });
    const secretString = JSON.stringify({
        accessKeyId,
        secretAccessKey
    });
    /*
    secretsManager.createSecret({
        Name: username,
        SecretString: secretString
    }, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Successfully stored secret in Secrets Manager.");
        }
    });
    
    secretsManager.createSecret({
        Name: username,
        SecretString: secretString
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data)
        }
    });

}


//await storeSecrets(username, accessKeyId, secretAccessKey);
async function m() {
    await storeSecrets("abc4", 'AKIAXJO26ZLBL5ZXXQI4', 'YA74nELundwin6ZHcYCrkJIsH7iDbfTIR1NDGeaK');
    const secret = await getSecret("abc4");
    console.log(secret);
}
m().catch((err) =>{
    console.log(err);
});
*/
async function storeSecrets(username, accessKeyId, secretAccessKey) {
    return new Promise((resolve, reject) => {
        AWS.config.update({
            region: 'eu-west-2',
            accessKeyId: ACCESS_ID,
            secretAccessKey: SECRET_KEY
        });
        const secretsManager = new AWS.SecretsManager({
            region: 'eu-west-2',
            accessKeyId: ACCESS_ID,
            secretAccessKey: SECRET_KEY
        });
        const secretString = JSON.stringify({
            accessKeyId,
            secretAccessKey
        });

        secretsManager.createSecret({
            Name: username,
            SecretString: secretString
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
async function cd() {
    const f = await getSecret('3f7c8c4f-e8e8-486b-a98b-fba06ab7d734');
    console.log(f);
}
//cd();
async function getSecret(username) {
    return new Promise((resolve, reject) => {
        var params = {
            SecretId: username
        };
        secretsManager.getSecretValue(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                let secretStr = JSON.parse(data.SecretString);
                resolve({
                    accessKeyId: secretStr.accessKeyId,
                    secretAccessKey: secretStr.secretAccessKey
                });
            }
        });
    });
}


function RegisterUser(email, name, password) {
    var attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "name", Value: `${name}` }));
    //attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"preferred_username",Value:"jay"}));
    //attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:"male"}));
    //attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:"1991-06-21"}));
    //attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"address",Value:"CMB"}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: `${email}` }));
    //attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"phone_number",Value:"+5412614324321"}));
    //attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"custom:scope",Value:"admin"}));
    let returner;
    /*
    userPool.signUp(`${email}`, `${password}`, attributeList, null, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        returner = cognitoUser.getUsername();
    });
    return(returner);
    */
    return new Promise((resolve, reject) => {
        userPool.signUp(`${email}`, `${password}`, attributeList, null, function (err, result) {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            resolve(cognitoUser.getUsername());
        });
    });
}

//RegisterUser();

function verifyConfirmationToken(username, password, confirmationCode, userPoolId, clientId) {
    // Configure the AWS SDK
    AWS.config.update({
        region: 'eu-west-2'
    });

    // Create a new instance of the CognitoIdentityServiceProvider client
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

    // Define the parameters for the confirmSignUp method
    const params = {
        ClientId: clientId,
        ConfirmationCode: confirmationCode,
        Username: username,
    };
    postverify(username,password);
    // Use the confirmSignUp method to verify the token
    return cognitoIdentityServiceProvider.confirmSignUp(params).promise();
}
/*
verifyConfirmationToken("cimek47215@quamox.com", "965816", "eu-west-2_O7s9esC0Z", "7tv8171sa8tkofbau14h4a90k5")
.then(data => {
    console.log('Successfully verified token.');
    console.log(data);
})
.catch(err => {
    console.log('Error verifying token.');
    console.log(err);
});
*/

function postverify(email, password) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
    });

    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
            //addBucket(result.getAccessToken().getJwtToken(), result.getIdToken().getJwtToken());
            await createIAMUserAndObjCreatePolicy(result.getIdToken().getJwtToken());
            //await createInitialS3Obj(result.getIdToken().getJwtToken());
        },
        onFailure: function (err) {
            console.log(err);
        },
    });
}

async function creates3Initial(email,password){
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
    });

    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async  function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
            
            const decoded = jwt.decode(result.getIdToken().getJwtToken());
            const username = decoded.sub;

            const getSec = await getSecret(username);
            console.log(getSec);
            const aCCESS_ID = getSec.accessKeyId;
            const sECRET_KEY = getSec.secretAccessKey;
            AWS.config.update({
                region: 'eu-west-2',
                accessKeyId: aCCESS_ID,
                secretAccessKey: sECRET_KEY
            });
            const s3 = new AWS.S3();
            const bucketName = 'legacy-locker-users';
            const objectKey = `${username}`;
            const objectBody = 'Wagwaan world';
            const folderKey = `${username}/`;
            const paramsS3 = {
                Bucket: bucketName,
                Key: objectKey,
                Body: objectBody,
            };

            s3.putObject(paramsS3, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    attachObjS3(username);
                }
            });
            
        },
        onFailure: function (err) {
            console.log(err);
        },

    });
}

function Login(email, password) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
    });

    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
            //addBucket(result.getAccessToken().getJwtToken(), result.getIdToken().getJwtToken());
            createIAMUserAndObjCreatePolicy(result.getIdToken().getJwtToken());
        },
        onFailure: function (err) {
            console.log(err);
        },

    });
}

//Login();
async function createIAMUserAndObjCreatePolicy(ID) {
    AWS.config.update({
        region: 'eu-west-2',
        accessKeyId: ACCESS_ID,
        secretAccessKey: SECRET_KEY
    });
    const decoded = jwt.decode(ID);
    const username = decoded.sub;
    const iam = new AWS.IAM({
        region: "us-west-2"
    });
    const paramsUser = {
        UserName: `${username}`
    };
    iam.createUser(paramsUser, function (err, data) {
        if (err) {
            reject(err);
        }
        else {
            iam.createAccessKey({
                UserName: username
            }, async (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    const AccessKeyId = data.AccessKey.AccessKeyId;
                    const SecretAccessKey = data.AccessKey.SecretAccessKey;
                    console.log("Access Key ID:", AccessKeyId);
                    const str = await storeSecrets(username, AccessKeyId, SecretAccessKey);
                    console.log("Secret Access Key:", SecretAccessKey);
                }
            });
        }
    });

    const policy = `{
        "Version": "2012-10-17",
        "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::legacy-locker-users/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:CreateSecret",
                "secretsmanager:DeleteSecret"
            ],
            "Resource": [
                "*"
            ]
        }
        ]
    }`;
    const params = {
        PolicyDocument: policy,
        PolicyName: `${username}-objCreate`
    };
    let arn;
    iam.createPolicy(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Policy.Arn);
            arn = data.Policy.Arn;
            const params = {
                PolicyArn: data.Policy.Arn,
                UserName: `${username}`
            };
            iam.attachUserPolicy(params, async (err, data) => {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Success", data);
                    console.log(username);
                }
            });
        }
    });
}
/*
async function callStoreSecrets(username, accessKeyId, secretAccessKey) {
    try {
        console.log('reached');
        const result = await storeSecrets(username, accessKeyId, secretAccessKey);
        //console.log(result);
        return (result);
    } catch (err) {
        console.error(err);
    }
}
*/
//createS3Obj("5d952d53-dd2c-4a1b-9bf0-17c840225f14", "AKIAXJO26ZLBHNI5PKLV", "CsyLpmfGxfBzqnYOyBX7QWyKyT5ABOUneZa7Paoj");
//AKIAXJO26ZLBA4EQXD4Y H2q++LTiUfBfQuYSNV170915JsLfQoUoBYGv8LQW
//AKIAXJO26ZLBHNI5PKLV CsyLpmfGxfBzqnYOyBX7QWyKyT5ABOUneZa7Paoj
async function createInitialS3Obj(username) {
    const iam = new AWS.IAM({
        region: "us-west-2"
    });
    iam.createAccessKey({
        UserName: username
    }, async (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const AccessKeyId = data.AccessKey.AccessKeyId;
            const SecretAccessKey = data.AccessKey.SecretAccessKey;
            console.log("Access Key ID:", AccessKeyId);
            const str = await storeSecrets(username, AccessKeyId, SecretAccessKey);
            console.log("Secret Access Key:", SecretAccessKey);
            const aCCESS_ID = AccessKeyId;
            const sECRET_KEY = SecretAccessKey;
            AWS.config.update({
                region: 'eu-west-2',
                accessKeyId: aCCESS_ID,
                secretAccessKey: sECRET_KEY
            });
            const s3 = new AWS.S3();
            const bucketName = 'legacy-locker-users';
            const objectKey = `${username}`;
            const objectBody = 'Wagwaan world';
            const folderKey = `${username}/`;
            const paramsS3 = {
                Bucket: bucketName,
                Key: objectKey,
                Body: objectBody,
            };

            s3.putObject(paramsS3, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    attachObjS3(username);
                }
            });
        }
    });
}

function attachObjS3(username) {
    AWS.config.update({
        region: 'eu-west-2',
        accessKeyId: ACCESS_ID,
        secretAccessKey: SECRET_KEY
    });
    const iam = new AWS.IAM();

    const policy = `{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject"
          ],
          "Resource": [
            "arn:aws:s3:::legacy-locker-users/${username}"
          ]
        }
      ]
    }`;
    //"arn:aws:secretsmanager::eu-west-501359758018:secret:${username}-COAkl0"
    const params = {
        PolicyDocument: policy,
        PolicyName: `${username}-rules`
    };
    let arn;


    iam.createPolicy(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Policy.Arn);
            arn = data.Policy.Arn;
            const params = {
                PolicyArn: data.Policy.Arn,
                UserName: `${username}`
            };
            iam.attachUserPolicy(params, (err, data) => {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("Success", data);
                }
            });
        }
    });
}
/*
db.query(`
    CREATE TABLE accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fName varchar(255),
    sName varchar(255),
    profileImage varchar(255),
    userDatabase INT,
    IPFSData varchar(255)
`);

db.query(`
DROP TABLE accounts;
`);
*/
const server = app.listen(PORT, () => {
    console.log(`example app is listening on ${PORT}`)
})