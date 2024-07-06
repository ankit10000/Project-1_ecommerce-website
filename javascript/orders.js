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

async function displayOrders() {
  const token = getCookie('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch('https://reshopapi.onrender.com/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const orders = await response.json();
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
      ordersList.innerHTML = '<p>No orders found.</p>';
      return;
    }

    ordersList.innerHTML = orders.map(order => `
      <div class="order">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <h3>Order Summary</h3>
        <table>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Subtotal</th>
          </tr>
          ${order.items.map(item => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.quantity}</td>
              <td>₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr>
            <td colspan="2"><strong>Total</strong></td>
            <td>₹${order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</td>
          </tr>
        </table>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error fetching orders:', error);
    alert('Error fetching orders. Please try again later.');
  }
}

document.addEventListener('DOMContentLoaded', displayOrders);