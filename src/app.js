const accounts = document.querySelector('#accounts')

fetch('http://localhost:3000/')
    .then(response => response.json())
    .then(data => console.log(data))