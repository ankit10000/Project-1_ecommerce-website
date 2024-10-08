async function fetchData() {
    const response = await fetch('https://reshopapi.onrender.com/api/user');
    const data = await response.json();
    return data;
}

function processChartData(data) {
    const id = data.map(item => item.id);
    const name = data.map(item => item.name);
    const visites = data.map(item => item.visites);
    return { visites, name, id };
}

function createChart(visites, name, id) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: id,
            datasets: [{
                label: 'Number of Visites',
                data: visites,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }]
        },

        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
async function fetchOrdersData() {
    const response1 = await fetch('https://reshopapi.onrender.com/api/ordersAdmin');
    const data1 = await response1.json();
    return data1;
}

function processChartOrdersData(data1) {
    const order_id = data1.map(item => item.order_id);
    const user_id = data1.map(item => item.user_id);
    const total = data1.map(item => item.total);
    return { user_id, order_id, total };
}

function createOrdersChart(user_id, order_id, total, name) {
    const ctxs = document.getElementById('mySales').getContext('2d');
    new Chart(ctxs, {
        type: 'line',
        data: {
            labels: order_id,
            datasets: [{
                label: 'Price',
                data: total,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'User Id',
                data: user_id,
                backgroundColor: 'rgba(192, 75, 192, 1)',
                borderColor: 'rgba(192, 75, 192, 1)',
                borderWidth: 1,
            },

            ]
        },

        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function run() {
    const data = await fetchData();
    const { visites, name, id } = processChartData(data);
    createChart(visites, name, id);
    const data1 = await fetchOrdersData();
    const { user_id, order_id, total } = processChartOrdersData(data1);
    createOrdersChart(user_id, order_id, total);
}

run();
function getCookieAdmin(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}


function setCookieAdmin(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
var token = getCookieAdmin('tokenadmin');
if (token) {
    async function fetchOrders() {
        try {
            const response = await fetch('https://reshopapi.onrender.com/api/ordersAdmin');
            const orders = await response.json();
            const ordersTableBody = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];

            ordersTableBody.innerHTML = '';

            orders.forEach(order => {
                const row = ordersTableBody.insertRow();
                row.insertCell(0).innerText = order.order_id;
                row.insertCell(1).innerText = order.user_id;
                row.insertCell(2).innerText = order.items;
                row.insertCell(3).innerHTML = order.address;
                row.insertCell(4).innerHTML = order.payment_method;
                row.insertCell(5).innerHTML = order.created_at;
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('An error occurred whinav ul lile fetching products.');
        }
    }

    async function fetchContacts() {
        try {
            const response = await fetch('https://reshopapi.onrender.com/api/get-submit-contact');
            const contacts = await response.json();
            const contactsTableBody = document.getElementById('contactsTable').getElementsByTagName('tbody')[0];

            contactsTableBody.innerHTML = '';

            contacts.forEach(contact => {
                const row = contactsTableBody.insertRow();
                row.insertCell(0).innerText = contact.id;
                row.insertCell(1).innerText = contact.name;
                row.insertCell(2).innerText = contact.email;
                row.insertCell(3).innerHTML = contact.message;
                row.insertCell(4).innerHTML = contact.created_at;
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('An error occurred whinav ul lile fetching products.');
        }
    }

    async function fetchUsers() {
        try {
            const response = await fetch('https://reshopapi.onrender.com/api/user');
            const users = await response.json();
            const usersTableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

            usersTableBody.innerHTML = '';

            users.forEach(user => {
                const row = usersTableBody.insertRow();
                row.insertCell(0).innerText = user.id;
                row.insertCell(1).innerText = user.name;
                row.insertCell(2).innerText = user.email;
                row.insertCell(3).innerText = user.contact;
                row.insertCell(4).innerHTML = `<input type="password" id="password" value="${user.password}" required disabled/>`;
                row.insertCell(5).innerHTML = user.address;
                row.insertCell(6).innerHTML = user.active ? 'Active' : 'Inactive';
                row.insertCell(7).innerHTML = user.admin ? 'Admin' : 'No';
                row.insertCell(8).innerHTML = user.visites;

            });
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('An error occurred while fetching products.');
        }
    }
    async function fetchProducts() {
        try {
            const response = await fetch('https://reshopapi.onrender.com/api/product/getproducts');
            const products = await response.json();
            const productsTableBody = document.getElementById('productsTable').getElementsByTagName('tbody')[0];

            productsTableBody.innerHTML = '';

            products.forEach(product => {
                const row = productsTableBody.insertRow();
                row.insertCell(0).innerText = product.id;
                row.insertCell(1).innerText = product.name;
                row.insertCell(2).innerText = product.price;
                row.insertCell(3).innerText = product.rating;
                row.insertCell(4).innerHTML = product.image;
                row.insertCell(5).innerHTML = `<img src="${product.image}" alt="${product.name}" width="50">`;
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('An error occurred while fetching products.');
        }
    }

    document.getElementById('addProduct').addEventListener('submit', async function (event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productRating = document.getElementById('productRating').value;
        const productImage = document.getElementById('productImage').value;

        const product = {
            name: productName,
            price: productPrice,
            rating: productRating,
            image: productImage
        };

        try {
            const response = await fetch('https://reshopapi.onrender.com/api/product/addproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                alert('Product added successfully!');
                document.getElementById('addProduct').reset();
                fetchProducts();
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the product.');
        }
    });

    document.getElementById('updateProduct').addEventListener('submit', async function (event) {
        event.preventDefault();

        const productId = document.getElementById('updateProductId').value;
        const productName = document.getElementById('updateProductName').value;
        const productPrice = document.getElementById('updateProductPrice').value;
        const productRating = document.getElementById('updateProductRating').value;
        const productImage = document.getElementById('updateProductImage').value;

        const product = {
            name: productName,
            price: productPrice,
            rating: productRating,
            image: productImage
        };

        try {
            const response = await fetch(`https://reshopapi.onrender.com/api/product/update/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                alert('Product updated successfully!');
                document.getElementById('updateProduct').reset();
                fetchProducts();
            } else {
                alert('Failed to update product.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the product.');
        }
    });

    // Delete Product
    document.getElementById('deleteProduct').addEventListener('submit', async function (event) {
        event.preventDefault();

        const productId = document.getElementById('deleteProductId').value;

        try {
            const response = await fetch(`https://reshopapi.onrender.com/api/product/delete/${productId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Product deleted successfully!');
                document.getElementById('deleteProduct').reset();
                fetchProducts();
            } else {
                alert('Failed to delete product.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the product.');
        }
    });



    document.addEventListener('DOMContentLoaded', fetchProducts);
    document.addEventListener('DOMContentLoaded', fetchUsers);
    document.addEventListener('DOMContentLoaded', fetchOrders);
    document.addEventListener('DOMContentLoaded', fetchContacts);
} else if (!token) {
    window.location.href = '../login.html';
}

