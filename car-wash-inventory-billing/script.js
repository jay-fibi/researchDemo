// Data storage
let inventory = JSON.parse(localStorage.getItem('carWashInventory')) || [];

// DOM elements
const inventoryTab = document.getElementById('inventoryTab');
const billingTab = document.getElementById('billingTab');
const inventorySection = document.getElementById('inventorySection');
const billingSection = document.getElementById('billingSection');
const inventoryForm = document.getElementById('inventoryForm');
const billingForm = document.getElementById('billingForm');
const inventoryBody = document.getElementById('inventoryBody');
const serviceSelect = document.getElementById('serviceSelect');
const invoiceDisplay = document.getElementById('invoiceDisplay');

// Tab switching
inventoryTab.addEventListener('click', () => {
    inventorySection.style.display = 'block';
    billingSection.style.display = 'none';
    inventoryTab.style.backgroundColor = '#777';
    billingTab.style.backgroundColor = '#555';
});

billingTab.addEventListener('click', () => {
    inventorySection.style.display = 'none';
    billingSection.style.display = 'block';
    billingTab.style.backgroundColor = '#777';
    inventoryTab.style.backgroundColor = '#555';
    populateServiceSelect();
});

// Inventory management
inventoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const price = parseFloat(document.getElementById('itemPrice').value);

    const newItem = { id: Date.now(), name, quantity, price };
    inventory.push(newItem);
    saveInventory();
    renderInventory();
    inventoryForm.reset();
});

function renderInventory() {
    inventoryBody.innerHTML = '';
    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="action-btn" onclick="editItem(${item.id})">Edit</button>
                <button class="action-btn" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        inventoryBody.appendChild(row);
    });
}

function editItem(id) {
    const item = inventory.find(i => i.id === id);
    if (item) {
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemQuantity').value = item.quantity;
        document.getElementById('itemPrice').value = item.price;
        deleteItem(id);
    }
}

function deleteItem(id) {
    inventory = inventory.filter(i => i.id !== id);
    saveInventory();
    renderInventory();
}

function saveInventory() {
    localStorage.setItem('carWashInventory', JSON.stringify(inventory));
}

// Billing
function populateServiceSelect() {
    serviceSelect.innerHTML = '';
    inventory.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        serviceSelect.appendChild(option);
    });
}

billingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const selectedServices = Array.from(serviceSelect.selectedOptions).map(option => parseInt(option.value));

    if (selectedServices.length === 0) {
        alert('Please select at least one service.');
        return;
    }

    generateInvoice(customerName, selectedServices);
    billingForm.reset();
});

function generateInvoice(customerName, serviceIds) {
    const selectedItems = inventory.filter(item => serviceIds.includes(item.id));
    let total = 0;
    let invoiceHTML = `<h3>Invoice for ${customerName}</h3><ul>`;

    selectedItems.forEach(item => {
        const itemTotal = item.price;
        total += itemTotal;
        invoiceHTML += `<li>${item.name} - $${item.price.toFixed(2)}</li>`;
    });

    invoiceHTML += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
    invoiceDisplay.innerHTML = invoiceHTML;
}

// Initialize
renderInventory();
