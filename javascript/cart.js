var MenuItems = document.getElementById('MenuItems');
MenuItems.style.maxHeight = '0px';

function menutoggle() {
    if (MenuItems.style.maxHeight == '0px') {
        MenuItems.style.maxHeight = '200px';
    } else {
        MenuItems.style.maxHeight = '0px';
    }
}

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
    if (cart.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="4">Your cart is empty.</td></tr>';
    }
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

async function handleCheckout(event) {
    event.preventDefault();
    const address = document.getElementById('checkoutAddress').value;
    const paymentMethod = document.getElementById('checkoutPaymentMethod').value;
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    const token = getCookie('token');
    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    if (items.length === 0) {
        alert('Your cart is empty');
    }
    else if (!token) {
        alert('You need to login to proceed with the checkout');
        window.location.href = 'login.html';
        return;
    } else {
        try {
            const response = await fetch('https://reshopapi.onrender.com/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items, address, paymentMethod, total: cartTotal })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Order placed successfully!');
                localStorage.removeItem('cart');
                updateCartCount();
                window.location.href = 'orders.html';
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Error placing order: ' + error.message);
        }
    }


}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cartItems')) {
        displayCartItems();
    }
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
});