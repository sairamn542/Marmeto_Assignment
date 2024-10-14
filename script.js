document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        .then(response => response.json())
        .then(data => {
            displayCartItems(data.items);
            calculateCartTotals(data.items);
        })
        .catch(error => console.error('Error fetching cart data:', error));

    function displayCartItems(items) {
        cartItemsContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;

        const tableBody = cartItemsContainer.querySelector('tbody');

        items.forEach(item => {
            const itemHTML = `
                <tr>
                    <td><img src="${item.image}" alt="${item.title}" /></td>
                    <td>${item.title}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td><input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}" /></td>
                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                    <td><button class="remove-item" data-id="${item.id}"><i class="fa-solid fa-trash"></i> Remove</button></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', itemHTML);
        });

        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', updateQuantity);
        });
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    function updateQuantity(event) {
        const itemId = event.target.dataset.id;
        const newQuantity = event.target.value;

        fetchCartData()
            .then(data => {
                const item = data.items.find(i => i.id == itemId);
                item.quantity = newQuantity;
                displayCartItems(data.items);
                calculateCartTotals(data.items);
            });
    }

    function removeItem(event) {
        const itemId = event.target.dataset.id;

        fetchCartData()
            .then(data => {
                data.items = data.items.filter(i => i.id != itemId);
                displayCartItems(data.items);
                calculateCartTotals(data.items);
            });
    }

    function calculateCartTotals(items) {
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
        cartTotal.textContent = `₹${subtotal.toFixed(2)}`;
    }

    function fetchCartData() {
        return fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
            .then(response => response.json());
    }

    checkoutBtn.addEventListener('click', () => {
        alert('Proceeding to checkout...');
    });
});

document.getElementById('hamburger').addEventListener('click', function () {
    const navItems = document.querySelector('.nav-items');
    navItems.classList.toggle('active'); // Toggle the active class to show/hide nav items
});
