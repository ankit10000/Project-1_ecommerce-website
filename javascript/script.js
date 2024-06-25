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


async function fetchProducts() {
    const response = await fetch('https://reshopapi.onrender.com/api/product/getproducts');
    const products = await response.json();
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = products.map(product => `
            <div class="col-4">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <div class="rating">
                    ${[...Array(product.rating)].map(() => '<i class="fas fa-star"></i>').join('')}
                    ${[...Array(5 - product.rating)].map(() => '<i class="far fa-star"></i>').join('')}
                </div>
                <p>₹${product.price}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            </div>
        `).join('');
    }

    const featuredProducts = document.getElementById('featured-products');
    if (featuredProducts) {
        featuredProducts.innerHTML = products.map(product => `
        <div class="col-4">
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <div class="rating">
                ${[...Array(product.rating)].map(() => '<i class="fas fa-star"></i>').join('')}
                ${[...Array(5 - product.rating)].map(() => '<i class="far fa-star"></i>').join('')}
            </div>
            <p>₹${product.price}</p>
            <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        </div>
    `).join('');
    }
}


// Function to fetch and display featured products
// async function fetchFeaturedProducts() {
//     const response = await fetch('https://reshopapi.onrender.com/api/product/getproducts');
//     const products = await response.json();
//     const featuredProducts = document.getElementById('featured-products');

//     featuredProducts.innerHTML = products.map(product => `
//         <div class="col-4">
//             <img src="${product.image}" alt="${product.name}">
//             <h4>${product.name}</h4>
//             <div class="rating">
//                 ${[...Array(product.rating)].map(() => '<i class="fas fa-star"></i>').join('')}
//                 ${[...Array(5 - product.rating)].map(() => '<i class="far fa-star"></i>').join('')}
//             </div>
//             <p>₹${product.price}</p>
//             <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
//         </div>
//     `).join('');
// }

// Call fetchFeaturedProducts when the document is loaded
// document.addEventListener('DOMContentLoaded', fetchFeaturedProducts);

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cartItems')) {
        displayCartItems();
    }
    fetchProducts();
    // fetchFeaturedProducts();
    const ctxSales = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctxSales, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Sales',
            data: [1200, 1900, 3000, 5000, 2300, 3400],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Customer Growth Chart
const ctxCustomer = document.getElementById('customerChart').getContext('2d');
const customerChart = new Chart(ctxCustomer, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
            label: 'Customers',
            data: [50, 100, 150, 200, 250, 300],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
});

