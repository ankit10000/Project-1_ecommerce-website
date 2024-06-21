const nav = document.querySelector('.navbar')
fetch('/navbar.html')
    .then(response => response.text())
    .then(data => {
        nav.innerHTML = data
    })