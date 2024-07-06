var MenuItems = document.getElementById('MenuItems');
        MenuItems.style.maxHeight = '0px';

        function menutoggle() {
            if (MenuItems.style.maxHeight == '0px') {
                MenuItems.style.maxHeight = '200px';
            } else {
                MenuItems.style.maxHeight = '0px';
            }
        }
        
        document.querySelectorAll('.offer .btn').forEach(button => {
            button.addEventListener('click', (event) => {
                event.target.textContent = 'Added';
                event.target.disabled = true;
                setTimeout(() => {
                    event.target.innerHTML = "Add to Cart &#8594;";
                    event.target.disabled = false;
                }, 1500);
            });
        });