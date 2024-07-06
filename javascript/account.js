var token = getCookie('token');
        if (token) {
            fetch('https://reshopapi.onrender.com/api/user-details', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => response.json())
                .then(data => {
                    document.getElementById('getId').value = data.id;
                    document.getElementById('getName').value = data.name;
                    document.getElementById('getEmail').value = data.email;
                    document.getElementById('getContact').value = data.contact;
                    document.getElementById('getPassword').value = data.password;
                    document.getElementById('getAddress').value = data.address;
                });
        } else {
            window.location.href = 'login.html';
        }

        document.getElementById('updateForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('getName').value;
            const email = document.getElementById('getEmail').value;
            const contact = document.getElementById('getContact').value;
            const password = document.getElementById('getPassword').value;
            const address = document.getElementById('getAddress').value;
            const userId = document.getElementById('getId').value;

            fetch(`https://reshopapi.onrender.com/api/user/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                name: name,
                email: email,
                contact: contact,
                password: password,
                address: address
            })
            }).then(response => response.json())
            .then(data => {
                if (data.message === 'User updated successfully') {
                alert('User updated successfully');
                } else {
                alert('User not updated');
                }
            });
        });

        function getUserIdFromToken(token) {
            // Implement the logic to extract the user ID from the token
            // and return it
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedToken = JSON.parse(window.atob(base64));
            return decodedToken.userId;
        }