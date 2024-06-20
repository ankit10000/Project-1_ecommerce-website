var MenuItems = document.getElementById('MenuItems');
        MenuItems.style.maxHeight = '0px';

        function menutoggle() {
            if (MenuItems.style.maxHeight == '0px') {
                MenuItems.style.maxHeight = '200px';
            } else {
                MenuItems.style.maxHeight = '0px';
            }
        }

        function displayCart() {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let cartItems = document.getElementById('cartItems');
            let cartTotal = document.getElementById('cartTotal');
            let cartCount = document.getElementById('cartCount');
            let total = 0;

            // Clear existing content
            cartItems.innerHTML = '';

            if (cart.length === 0) {
                cartItems.innerHTML = '<tr><td colspan="4">No items in cart</td></tr>';
                cartTotal.innerText = '₹0.00';
                cartCount.innerText = '0';
            } else {
                cart.forEach((item, index) => {
                    let subtotal = item.price;
                    total += subtotal;
                    cartItems.innerHTML += `
        <tr>
          <td>${item.name}</td>
          <td>1</td>
          <td>₹${subtotal.toFixed(2)}</td>
          <td><button onclick="deleteFromCart(${index})">Delete</button></td>
        `;
                });
                cartTotal.innerText = `₹${total.toFixed(2)}`;
                cartCount.innerText = cart.length;
            }
        }

        function deleteFromCart(index) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload(); // Reload the page to update the cart
        }

        function proceedToCheckout() {
            const user = JSON.parse(sessionStorage.getItem('user'));
            if (user) {
                window.location.href = 'checkout.html';
            } else {
                alert('Please log in or register to proceed to checkout.');
                window.location.href = 'login.html';
            }
        }

        window.onload = displayCart;