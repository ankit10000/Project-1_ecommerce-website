var MenuItems = document.getElementById('MenuItems');
    MenuItems.style.maxHeight = '0px';

    function menutoggle() {
      if (MenuItems.style.maxHeight == '0px') {
        MenuItems.style.maxHeight = '200px';
      } else {
        MenuItems.style.maxHeight = '0px';
      }
    }

    function addToCart(productName, productPrice) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name: productName, price: productPrice });
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Added to Cart: ' + productName);
    }

    function buyNow(productName, productPrice) {
      document.getElementById('userRegistrationForm').style.display = 'block';
      document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        registerUser(productName, productPrice);
      });
    }

    function registerUser(productName, productPrice) {
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const user = { username: username, email: email };
      localStorage.setItem('user', JSON.stringify(user));
      alert('User registered: ' + username + '\nProceeding to buy: ' + productName);
      addToCart(productName, productPrice);
      alert('Purchased: ' + productName);
      document.getElementById('userRegistrationForm').style.display = 'none';
    }