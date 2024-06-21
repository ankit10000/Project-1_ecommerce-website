function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}


function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function deleteCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}


function logout() {
    deleteCookie('token');
    localStorage.removeItem('cart');
    window.location.href = 'login.html';
}


function addToCart(productName, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => item.productName === productName);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ productName, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}


function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = cartCount);
}


function displayCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItems = document.getElementById('cartItems');
    let cartTotal = 0;

    cartItems.innerHTML = '';
    cart.forEach(item => {
        cartTotal += item.price * item.quantity;
        cartItems.innerHTML += `
                <tr>
                    <td>${item.productName}</td>
                    <td>
                        <button onclick="updateCartItem('${item.productName}', -1)">-</button>
                        ${item.quantity}
                        <button onclick="updateCartItem('${item.productName}', 1)">+</button>
                    </td>
                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button onclick="removeCartItem('${item.productName}')">Remove</button></td>
                </tr>
            `;
    });

    document.getElementById('cartTotal').textContent = `₹${cartTotal.toFixed(2)}`;
}


function updateCartItem(productName, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => item.productName === productName);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.productName !== productName);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
}


function removeCartItem(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.productName !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}


function showLogout() {
    if (getCookie('token')) {
        document.getElementById('logout').style.display = 'contents';
        document.getElementById('a').style.marginRight = '10px';
    }
}

window.reload = showLogout();

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cartItems')) {
        displayCartItems();
    }
});

