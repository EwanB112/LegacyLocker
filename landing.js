const signUpButt = document.querySelector('#signUpButt');
const loginButt = document.querySelector('#loginButt');
const signUpC = document.querySelector('#signUpClose');
const loginC = document.querySelector('#loginClose');
const signUpSub = document.querySelector("#signUpSubmit");
const loginSub = document.querySelector('#loginSubmit');
var blurer = document.getElementById("blur");
const signUpF = document.querySelector('#signUpForm');
const loginF = document.querySelector("#loginForm");
const verifyF = document.querySelector('#verifyForm');


signUpButt.addEventListener('click', () => {
    signUpOpen();
});

loginButt.addEventListener('click', () => {
    loginOpen();
});

signUpC.addEventListener('click', () => {
    signUpClose();
});

loginC.addEventListener('click', () => {
    loginClose();
});

function signUpClose() {
    signUpF.style.display = "none";
    blurer.style.filter = "none";
}

function signUpOpen() {
    signUpF.style.display = "block";
    blurer.style.filter = "blur(10px)";
}

function loginClose() {
    loginF.style.display = "none";
    blurer.style.filter = "none";
}

function loginOpen() {
    loginF.style.display = "block";
    blurer.style.filter = "blur(10px)";
}

signUpF.addEventListener('submit', async (event) => {
    event.preventDefault();
    var Name = document.getElementById("signUpName").value;
    var Email = document.getElementById("signUpEmail").value;
    var Password = document.getElementById("signUpPassword").value;
    const usAndPas = JSON.stringify({
        email: Email,
        password: Password
    });
    setCookie("acc", usAndPas);
    const response = await fetch('http://localhost:3000/signUp', {
        method: 'POST',
        body: JSON.stringify({
            email: Email,
            name: Name,
            password: Password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.text())
        .then(text => {
            console.log(text);
            signUpF.style.display = "none";
            var blur = document.getElementById("blur");
            verifyF.style.display = "block";
            blur.style.filter = "blur(10px)";
        })
});
/*
async function verify() {
    const code = document.getElementById("verifyCode").value;
    var email = sessionStorage.getItem("email");
    fetch('http://localhost:3000/verify', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            code: code
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.text())
        .then(text => {
            console.log(text);
        })
}
*/
verifyF.addEventListener('submit', async (event) => {
    event.preventDefault();
    const Code = document.getElementById("verifyCode").value;
    var username = getCookie("acc");
    var obj = JSON.parse(username);
    const response = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        body: JSON.stringify({
            email: obj.email,
            password: obj.password,
            code: Code
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.text())
        .then(text => {
            console.log(text);
            console.log('success');
            if (text == "Successfully verified token.") {
                console.log('fe');
                var username = getCookie("acc");
                var obj = JSON.parse(username);
                cs3(obj.email, obj.password);
                //cs3(obj.email, obj.password);
                //window.location = '../dashboard/dashboard.html';
            }
        })
});
var username = getCookie("acc");
var obj = JSON.parse(username);
cs3(obj.email, obj.password);
/*
function login() {
    var Email = document.getElementById("loginEmail").value;
    var Password = document.getElementById("loginPassword").value;
    fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify({
            email: Email,
            password: Password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }) //http://legacylocker-env.eba-p23a2nxy.eu-west-2.elasticbeanstalk.com/
}
*/
loginF.addEventListener('submit', async (event) => {
    event.preventDefault();
    var Email = document.getElementById("loginEmail").value;
    var Password = document.getElementById("loginPassword").value;
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify({
            email: Email,
            password: Password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
});
//cs3();

async function cs3(username, password) {
    const response2 = await fetch('http://localhost:3000/creates3Initial', {
        method: 'POST',
        body: JSON.stringify({
            email: username,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

function setCookie(getter, usAndPas) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = getter + "=" + usAndPas + ";" + expires + ";path=/";
}



function getCookie(username) {
    var name = username + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}