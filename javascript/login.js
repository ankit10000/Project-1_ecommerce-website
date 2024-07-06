var MenuItems = document.getElementById('MenuItems');
        MenuItems.style.maxHeight = '0px';

        function menutoggle() {
            if (MenuItems.style.maxHeight == '0px') {
                MenuItems.style.maxHeight = '200px';
            } else {
                MenuItems.style.maxHeight = '0px';
            }
        }
        function redirectToLoginIfNotLoggedIn() {
            if (getCookie('token')) {
                window.location.href = 'index.html';
            }
        }
        window.onload = redirectToLoginIfNotLoggedIn;
        function login() {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('Indicator').style.transform = 'translateX(0px)';
            document.getElementById('form-container').style.height = '300px';
        }

        function register() {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'block';
            document.getElementById('Indicator').style.transform = 'translateX(147px)';
            document.getElementById('form-container').style.height = '440px';
        }

        async function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const visites = parseInt(localStorage.getItem('visits')) + 1;

            try {
                const response = await fetch('https://reshopapi.onrender.com/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, visites })
                });
                const data = await response.json();
                if (response.status === 200) {
                    alert('Logged in successfully!');
                    document.cookie = `token=${data.token}; path=/`;
                    localStorage.setItem('visits', visites.toString());
                    window.location.href = 'index.html';
                } else if (response.status === 201) {
                    alert('Logged in successfully!');
                    document.cookie = `tokenadmin=${data.token}; path=/`;
                    localStorage.setItem('visits', visites.toString());
                    window.location.href = 'admin/AddProduct.html';
                } else if (response.status === 401) {
                    alert('Invalid email or password');
                } else if (response.status === 501) {
                    alert('User is not active');
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Error logging in: ' + error.message);
            }
        }

        document.getElementById('loginForm').addEventListener('submit', handleLogin);

        async function handleRegister(event) {
            event.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const contact = document.getElementById('registerContact').value;
            const password = document.getElementById('registerPassword').value;
            const address = document.getElementById('registerAddress').value;
            const active = true;
            const admin = false;

            try {
                const response = await fetch('https://reshopapi.onrender.com/api/user/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, contact, password, address, active, admin })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Registered successfully!');
                    document.cookie = `token=${data.token}; path=/`;
                    window.location.href = 'index.html';
                } else {
                    alert(data.error);
                }
            } catch (error) {
                alert('Error registering: ' + error.message);
            }
        }

        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('registerForm').addEventListener('submit', handleRegister);