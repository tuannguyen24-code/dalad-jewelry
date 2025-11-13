/// =================================================================
// DỮ LIỆU MOCK (Thay thế cho Database)
// =================================================================
const initialProducts = [
    { id: 1, name: "Nhẫn Bạc Hoa Tuyết", category: "nhan", price: 550000, stock: 50, images: ['vong4.jpg'] },
    { id: 2, name: "Dây Chuyền Trái Tim", category: "daychuyen", price: 890000, stock: 35, images: ["vong5.jpg"] },
];

const initialCategories = [
    { id: 101, name: "Nhẫn", slug: "nhan" },
    { id: 102, name: "Dây Chuyền", slug: "daychuyen" },
    { id: 103, name: "Bông Tai", slug: "bongtai" },
];

const initialOrders = [
    { id: 'DH001', customer: 'Nguyễn Văn A', email: 'a@example.com', phone: '0901234567', total: 1200000, status: 'Đã giao', date: '2025-10-20', items: [{ name: "Nhẫn Bạc Hoa Tuyết", qty: 2, price: 550000 }] },
    { id: 'DH002', customer: 'Trần Thị B', email: 'b@example.com', phone: '0987654321', total: 890000, status: 'Đang xử lý', date: '2025-11-05', items: [{ name: "Dây Chuyền Trái Tim", qty: 1, price: 890000 }] },
];

// =================================================================
// 1. LẤY DỮ LIỆU TỪ LOCAL STORAGE
// =================================================================
const getLocalStorageData = (key, initialData) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : initialData;
};

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

let products = getLocalStorageData('adminProducts', initialProducts);
let categories = getLocalStorageData('adminCategories', initialCategories);
let orders = getLocalStorageData('adminOrders', initialOrders);

// ✅ Đồng bộ đơn hàng từ trang web (dalad_orders)
const shopOrders = JSON.parse(localStorage.getItem('dalad_orders') || '[]');
if (shopOrders.length > 0) {
    shopOrders.forEach(o => {
        if (!orders.some(x => x.id === o.id)) orders.push(o);
    });
    localStorage.setItem('adminOrders', JSON.stringify(orders));
}

// =================================================================
// 2. CHUYỂN ĐỔI GIAO DIỆN
// =================================================================
const switchSection = (sectionId) => {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`.nav-link[data-section="${sectionId}"]`).classList.add('active');

    if (sectionId === 'products') renderProductList();
    if (sectionId === 'categories') renderCategoryList();
    if (sectionId === 'orders') renderOrderList();
    if (sectionId === 'customers') renderCustomerList();
    if (sectionId === 'dashboard') renderDashboardStats();
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(e.target.getAttribute('data-section'));
        });
    });
    switchSection('dashboard');

    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
    document.getElementById('category-form').addEventListener('submit', handleCategorySubmit);
});

// =================================================================
// 3. QUẢN LÝ SẢN PHẨM
// =================================================================
const renderProductList = () => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price.toLocaleString('vi-VN')} VNĐ</td>
            <td>${p.stock}</td>
            <td>${p.images.length} ảnh</td>
            <td>
                <button class="edit-btn" onclick="openProductModal(${p.id})">Sửa</button>
                <button class="delete-btn" onclick="deleteProduct(${p.id})">Xóa</button>
            </td>
        `;
        productList.appendChild(row);
    });
};

const openProductModal = (id) => {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const categorySelect = document.getElementById('product-category');
    categorySelect.innerHTML = categories.map(c => `<option value="${c.slug}">${c.name}</option>`).join('');
    form.reset();
    document.getElementById('product-id').value = '';

    if (id) {
        const p = products.find(x => x.id === id);
        if (p) {
            document.getElementById('product-id').value = p.id;
            document.getElementById('product-name').value = p.name;
            document.getElementById('product-price').value = p.price;
            document.getElementById('product-stock').value = p.stock;
            document.getElementById('product-category').value = p.category;
            document.getElementById('product-images').value = p.images.join(', ');
        }
        modal.querySelector('h4').textContent = 'Chỉnh Sửa Sản Phẩm';
    } else {
        modal.querySelector('h4').textContent = 'Thêm Sản Phẩm Mới';
    }
    modal.style.display = 'flex';
};

const handleProductSubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseInt(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const category = document.getElementById('product-category').value;
    const images = document.getElementById('product-images').value.split(',').map(i => i.trim()).filter(i => i);

    if (id) {
        const i = products.findIndex(p => p.id === parseInt(id));
        if (i !== -1) products[i] = { ...products[i], name, price, stock, category, images };
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, price, stock, category, images });
    }
    saveToLocalStorage('adminProducts', products);
    renderProductList();
    closeModal('product-modal');
};

const deleteProduct = (id) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        products = products.filter(p => p.id !== id);
        saveToLocalStorage('adminProducts', products);
        renderProductList();
    }
};

// =================================================================
// 4. QUẢN LÝ DANH MỤC
// =================================================================
const renderCategoryList = () => {
    const el = document.getElementById('category-list');
    el.innerHTML = '';
    categories.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.slug}</td>
            <td>
                <button class="edit-btn" onclick="openCategoryModal(${c.id})">Sửa</button>
                <button class="delete-btn" onclick="deleteCategory(${c.id})">Xóa</button>
            </td>`;
        el.appendChild(row);
    });
};

const openCategoryModal = (id) => {
    const modal = document.getElementById('category-modal');
    const form = document.getElementById('category-form');
    form.reset();
    document.getElementById('category-id').value = '';

    if (id) {
        const c = categories.find(x => x.id === id);
        if (c) {
            document.getElementById('category-id').value = c.id;
            document.getElementById('category-name').value = c.name;
            document.getElementById('category-slug').value = c.slug;
        }
        modal.querySelector('h4').textContent = 'Chỉnh Sửa Danh Mục';
    } else modal.querySelector('h4').textContent = 'Thêm Danh Mục Mới';
    modal.style.display = 'flex';
};

const handleCategorySubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    const slug = document.getElementById('category-slug').value;

    if (id) {
        const i = categories.findIndex(c => c.id === parseInt(id));
        if (i !== -1) categories[i] = { ...categories[i], name, slug };
    } else {
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 101;
        categories.push({ id: newId, name, slug });
    }
    saveToLocalStorage('adminCategories', categories);
    renderCategoryList();
    closeModal('category-modal');
};

const deleteCategory = (id) => {
    if (confirm('Xóa danh mục này sẽ ảnh hưởng đến sản phẩm. Bạn có chắc chắn?')) {
        categories = categories.filter(c => c.id !== id);
        saveToLocalStorage('adminCategories', categories);
        renderCategoryList();
    }
};

// =================================================================
// HÀM TIỆN ÍCH CHO ĐƠN HÀNG (MỚI)
// =================================================================
const formatOrderItems = (items) => {
    // Mỗi item có cấu trúc { name: string, qty: number, price: number }
    return items.map(item => {
        // Có thể thêm size nếu có trong data, hiện tại chỉ dùng tên và số lượng
        return `• ${item.name} x ${item.qty}`;
    }).join('<br>'); // Dùng <br> để mỗi sản phẩm hiển thị trên một dòng
};

// =================================================================
// 5. QUẢN LÝ ĐƠN HÀNG & KHÁCH HÀNG (ĐÃ SỬA ĐỔI)
// =================================================================
const renderOrderList = () => {
    const el = document.getElementById('order-list');
    el.innerHTML = '';
    orders.forEach(o => {
        let statusColor = '';
        // Hàm getStatusClass sẽ là cách tốt hơn, nhưng giữ nguyên style attribute theo code cũ
        if (o.status === 'Đã giao') statusColor = 'style="color:green;font-weight:bold"';
        else if (o.status === 'Đang xử lý') statusColor = 'style="color:orange;font-weight:bold"';
        else if (o.status === 'Đã hủy') statusColor = 'style="color:red;font-weight:bold"';

        const productListHTML = formatOrderItems(o.items); // Lấy danh sách sản phẩm

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${o.id}</td>
            <td>${o.customer}</td>
            <td>${o.phone || 'N/A'}</td> <td>${productListHTML}</td> <td>${o.total.toLocaleString('vi-VN')} VNĐ</td>
            <td>${o.date}</td>
            <td ${statusColor}>${o.status}</td>
            <td><button class="edit-btn" onclick="promptUpdateOrderStatus('${o.id}','${o.status}')">Cập nhật TT</button></td>
        `;
        el.appendChild(row);
    });
};

const promptUpdateOrderStatus = (id, current) => {
    const newStatus = prompt(`Cập nhật trạng thái cho đơn ${id} (Hiện tại: ${current})`);
    if (newStatus) {
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = newStatus;
            saveToLocalStorage('adminOrders', orders);
            renderOrderList();
        }
    }
};

const renderCustomerList = () => {
    const el = document.getElementById('customer-list');
    el.innerHTML = '';
    const map = new Map();
    orders.forEach(o => {
        if (!map.has(o.phone)) {
            map.set(o.phone, { id: Math.random().toString(36).substring(7).toUpperCase(), name: o.customer, email: o.email, phone: o.phone, totalSpent: o.total });
        } else {
            const c = map.get(o.phone);
            c.totalSpent += o.total;
        }
    });
    map.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${c.id}</td><td>${c.name}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.totalSpent.toLocaleString('vi-VN')} VNĐ</td>`;
        el.appendChild(row);
    });
};

// =================================================================
// 6. THỐNG KÊ DOANH THU
// =================================================================
const renderDashboardStats = () => {
    const el = document.getElementById('stats-summary');
    el.innerHTML = '';
    const success = orders.filter(o => o.status === 'Đã giao');
    const totalRev = success.reduce((s, o) => s + o.total, 0);
    const stats = [
        { title: 'Tổng Doanh Thu', value: `${totalRev.toLocaleString('vi-VN')} VNĐ` },
        { title: 'Tổng Đơn Hàng', value: orders.length },
        { title: 'Số Sản Phẩm', value: products.length },
    ];
    stats.forEach(s => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `<h4>${s.title}</h4><p>${s.value}</p>`;
        el.appendChild(card);
    });
};

// =================================================================
// 7. HÀM TIỆN ÍCH KHÁC
// =================================================================
const closeModal = (id) => {
    document.getElementById(id).style.display = 'none';
};