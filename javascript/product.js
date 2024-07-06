var MenuItems = document.getElementById('MenuItems');
        MenuItems.style.maxHeight = '0px';

        function menutoggle() {
            if (MenuItems.style.maxHeight == '0px') {
                MenuItems.style.maxHeight = '200px';
            } else {
                MenuItems.style.maxHeight = '0px';
            }
        }

        let products = [];

        async function fetchProducts() {
            try {
                const response = await fetch('https://reshopapi.onrender.com/api/product/getproducts');
            products = await response.json();
            displayProducts(products);
            } catch (error) {
                response.status(500).send({ message: 'Internal Server Error' });
            }
            
        }
        function filterProducts() {
            const minPrice = parseInt(document.getElementById('minPrice').value);
            const maxPrice = parseInt(document.getElementById('maxPrice').value);
            const filteredProducts = products.filter(product => product.price >= minPrice && product.price <= maxPrice);
            displayProducts(filteredProducts);
        }
        function clearFilter() {
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            displayProducts(products);
        }
        function displayProducts(products) {
            const productList = document.getElementById('product-list');
            productList.innerHTML = products.map(product => `
                <div class="col-4">
                    <img src="${product.image}" alt="${product.name}">
                    <h4>${product.name}</h4>
                    <div class="rating">
                        ${[...Array(product.rating)].map(() => '<i class="fas fa-star"></i>').join('')}
                        ${[...Array(5 - product.rating)].map(() => '<i class="far fa-star"></i>').join('')}
                    </div>
                    <p>₹${product.price}</p>
                    <button class="add-to-cart" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
            </div>
        `).join('');

        // Add event listeners to buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                addToCart(event.target.dataset.name, event.target.dataset.price);
                event.target.textContent = 'Added';
                event.target.disabled = true;
                setTimeout(() => {
                event.target.innerHTML = "Add to Cart &#8594;";
                event.target.disabled = false;
            }, 1500); // Optional: disable the button after adding
            });
        });
        }

        function sortProducts(criteria) {
            let sortedProducts = [...products];
            if (criteria === 'latest') {
                sortedProducts.sort((a, b) => b.id - a.id);
            } else if (criteria === 'low_price') {
                sortedProducts.sort((a, b) => a.price - b.price);
            } else if (criteria === 'highest_price') {
                sortedProducts.sort((a, b) => b.price - a.price);
            } else if (criteria === 'rating') {
                sortedProducts.sort((a, b) => b.rating - a.rating);
            }
            displayProducts(sortedProducts);
        }

        document.getElementById('sortOptions').addEventListener('change', (event) => {
            const criteria = event.target.value;
            sortProducts(criteria);
        });

        fetchProducts();