/// =================================================================
// DỮ LIỆU MOCK (Thay thế cho Database)
// =================================================================
const initialProducts = [
    // Thêm description và discount
    { id: 1, name: "Nhẫn Bạc Hoa Tuyết", category: "nhan", description: "Nhẫn bạc S925 đính đá CZ hình hoa tuyết tinh xảo. Phù hợp cho dịp Giáng Sinh.", price: 550000, stock: 50, images: ['vong4.jpg'], discount: "freeship" },
    { id: 2, name: "Dây Chuyền Trái Tim", category: "daychuyen", description: "Dây chuyền mặt trái tim lồng đôi, làm từ vàng trắng 14K. Món quà hoàn hảo cho người yêu.", price: 890000, stock: 35, images: ["vong5.jpg"], discount: "freeship" },
    // Thêm một sản phẩm mới để mô phỏng data
    { id: 3, name: "Vòng Tay Chuỗi Ngọc", category: "vongtay", description: "Vòng tay chuỗi ngọc trai nước ngọt, thanh lịch và quý phái.", price: 1200000, stock: 15, images: ["vong6.jpg"], discount: "freeship" },
    { id: 4, name: "Dây Chuyền Bạc Thanh Lịch", category: "daychuyen", description: "Bạc S925, chuỗi hạt đá thả rơi, lấp lánh nhẹ nhàng", price: 1200000, stock: 15, images: ["vong1.jpg"], discount: "" },
    { id: 5, name: "Vòng Tay Bạc Tình Yêu Charm", category: "vongtay", description: "BVòng hạt/bi, mặt charm hình trái tim đính đá nhỏ, có móc nối.", price: 1200000, stock: 15, images: ["vong1.jpg"], discount: "" },

];

const initialCategories = [
    { id: 101, name: "Nhẫn", slug: "nhan" },
    { id: 102, name: "Dây Chuyền", slug: "daychuyen" },
    { id: 103, name: "Bông Tai", slug: "bongtai" },
    // Thêm danh mục mới
    { id: 104, name: "Vòng Tay", slug: "vongtay" },
];

const initialOrders = [
    // Thêm trường items chi tiết hơn
    { id: 'DH001', customer: 'Nguyễn Văn A', email: 'a@example.com', phone: '0901234567', total: 1200000, status: 'Đã giao', date: '2025-10-20', items: [{ name: "Nhẫn Bạc Hoa Tuyết", qty: 2, price: 550000 }, { name: "Dây Chuyền Trái Tim", qty: 1, price: 100000 }] }, 
    { id: 'DH002', customer: 'Trần Thị B', email: 'b@example.com', phone: '0987654321', total: 890000, status: 'Đang xử lý', date: '2025-11-05', items: [{ name: "Dây Chuyền Trái Tim", qty: 1, price: 890000 }] },
    { id: 'DH003', customer: 'Lê Văn C', email: 'c@example.com', phone: '0912345678', total: 1200000, status: 'Đã giao', date: '2025-11-10', items: [{ name: "Vòng Tay Chuỗi Ngọc", qty: 1, price: 1200000 }] },
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
    
    // LOGIC ĐỒNG BỘ GIÁ SẢN PHẨM VỀ TRANG WEB (Key: dalad_products)
    if (key === 'adminProducts') {
        localStorage.setItem('dalad_products', JSON.stringify(data)); 
    }
}
// =================================================================
// QUẢN LÝ ĐÁNH GIÁ SẢN PHẨM
// =================================================================

// Đọc danh sách review từ LocalStorage hoặc tạo 3 bình luận mẫu nếu chưa có
let reviews = JSON.parse(localStorage.getItem("reviews") || "[]");

if (reviews.length === 0) {
    reviews = [
        {
            productId: 1,
            name: "Nguyễn Thị Lan",
            rating: 5,
            comment: "Sản phẩm rất đẹp, sáng bóng và tinh xảo hơn mong đợi. Đóng gói sang trọng!",
            images: [],
            date: "2025-11-01T10:15:00"
        },
        {
            productId: 2,
            name: "Trần Đức Minh",
            rating: 4,
            comment: "Dây chuyền đeo đẹp, tuy nhiên giao hàng hơi lâu một chút, nhưng vẫn rất hài lòng.",
            images: [],
            date: "2025-11-06T14:05:00"
        },
        {
            productId: 3,
            name: "Phạm Hồng Phúc",
            rating: 5,
            comment: "Vòng tay ngọc trai tinh tế, rất phù hợp làm quà tặng. Vợ mình rất thích!",
            images: [],
            date: "2025-11-10T09:30:00"
        }
    ];
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

function renderReviewList() {
    const tbody = document.getElementById("review-list");
    tbody.innerHTML = "";

    const pf = document.getElementById("review-product-filter").value;
    const sf = document.getElementById("review-star-filter").value;

    let filtered = [...reviews];

    if (pf !== "all") filtered = filtered.filter(r => r.productId == pf);
    if (sf !== "all") filtered = filtered.filter(r => r.rating == sf);

    filtered.forEach((r, index) => {
        const product = products.find(p => p.id == r.productId);
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product ? product.name : "Không xác định"}</td>
            <td>${r.name}</td>
            <td>${"⭐".repeat(r.rating)}</td>
            <td>${r.comment}</td>
            <td>${r.date ? new Date(r.date).toLocaleDateString("vi-VN") : ""}</td>
            <td>${r.images && r.images.length ? r.images.length + " ảnh" : "—"}</td>
            <td><button class="delete-btn" onclick="deleteReview(${index})">Xóa</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteReview(i) {
    if (!confirm("Xóa đánh giá này?")) return;
    reviews.splice(i, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    renderReviewList();
}

function loadReviewFilters() {
    const sel = document.getElementById("review-product-filter");
    sel.innerHTML = `<option value="all">Tất cả sản phẩm</option>` +
        products.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
}

let products = getLocalStorageData('adminProducts', initialProducts);
let categories = getLocalStorageData('adminCategories', initialCategories);
let orders = getLocalStorageData('adminOrders', initialOrders);

// ✅ Đồng bộ đơn hàng từ trang web (dalad_orders)
const shopOrders = JSON.parse(localStorage.getItem('dalad_orders') || '[]');
if (shopOrders.length > 0) {
    shopOrders.forEach(o => {
        // Chỉ thêm nếu đơn hàng chưa tồn tại trong danh sách admin
        if (!orders.some(x => x.id === o.id)) orders.push(o);
    });
    localStorage.setItem('adminOrders', JSON.stringify(orders));
}
// =================================================================
// TRONG admin.js - HÀM renderOrders
// =================================================================
const renderOrders = () => {
    loadOrders(); 
    const el = document.getElementById('orders-list-admin');
    el.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.customer} (${order.email})</td> 
            <td>${order.total.toLocaleString('vi-VN')} VNĐ</td>
            <td>
                <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-select status-${order.status.replace(/\s/g, '-')}">
                    </select>
            </td>
            <td>${order.date}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewOrderDetails('${order.id}')">Chi tiết</button>
            </td>
        `;
        el.appendChild(row);
    });
};
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
    if (sectionId === 'inventory') renderInventoryList(); 
    if (sectionId === 'dashboard') renderDashboardStats();
    if (sectionId === 'reviews') {
    reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    loadReviewFilters();
    renderReviewList();
}

};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = e.target.getAttribute('data-section') || e.target.closest('a').getAttribute('data-section');
            if (sectionId) switchSection(sectionId);
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
        const categoryName = categories.find(c => c.slug === p.category)?.name || p.category;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${categoryName}</td>
            <td>${p.price.toLocaleString('vi-VN')} VNĐ</td>
            <td>${p.stock}</td>
            <td>${p.images.length} ảnh</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="openProductModal(${p.id})">Sửa</button>
                    <button class="delete-btn" onclick="deleteProduct(${p.id})">Xóa</button>
                </div>
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
            document.getElementById('product-description').value = p.description || ''; 
            document.getElementById('product-discount').value = p.discount || ''; 
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
    const description = document.getElementById('product-description').value;
    const discount = document.getElementById('product-discount').value;
    const price = parseInt(document.getElementById('product-price').value); 
    const stock = parseInt(document.getElementById('product-stock').value);
    const category = document.getElementById('product-category').value;
    const images = document.getElementById('product-images').value.split(',').map(i => i.trim()).filter(i => i);

    const newProductData = { name, price, stock, category, images, description, discount }; 

    if (id) {
        const i = products.findIndex(p => p.id === parseInt(id));
        if (i !== -1) products[i] = { ...products[i], ...newProductData };
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...newProductData });
    }
    
    // LƯU VÀO LOCAL STORAGE VÀ ĐỒNG BỘ CHO TRANG WEB
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
                <div class="action-btns">
                    <button class="edit-btn" onclick="openCategoryModal(${c.id})">Sửa</button>
                    <button class="delete-btn" onclick="deleteCategory(${c.id})">Xóa</button>
                </div>
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
// 5. QUẢN LÝ ĐƠN HÀNG & KHÁCH HÀNG
// =================================================================
const renderOrderList = () => {
    const el = document.getElementById('order-list');
    el.innerHTML = '';
    orders.forEach(o => {
        let statusColor = '';
        if (o.status === 'Đã giao') statusColor = 'style="color:green;font-weight:bold"';
        else if (o.status === 'Đang xử lý') statusColor = 'style="color:orange;font-weight:bold"';
        else if (o.status === 'Đã hủy') statusColor = 'style="color:red;font-weight:bold"';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${o.id}</td>
            <td>${o.customer}</td>
            <td>${o.date}</td>
            <td>${o.total.toLocaleString('vi-VN')} VNĐ</td>
            <td ${statusColor}>${o.status}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="promptUpdateOrderStatus('${o.id}','${o.status}')">Cập nhật TT</button>
                    <button class="delete-btn" onclick="deleteOrder('${o.id}')">Xóa</button> 
                </div>
            </td>
        `;
        el.appendChild(row);
    });
};

const promptUpdateOrderStatus = (id, current) => {
    const newStatus = prompt(`Cập nhật trạng thái cho đơn ${id} (Hiện tại: ${current}). Vui lòng nhập: Chờ xử lý, Đang giao, Đã giao, Đã hủy`);
    if (newStatus) {
        const order = orders.find(o => o.id === id);
        if (order) {
            order.status = newStatus.trim();
            saveToLocalStorage('adminOrders', orders);
            renderOrderList();
        }
    }
};

const deleteOrder = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng ${id} này không? Hành động này không thể hoàn tác.`)) {
        orders = orders.filter(o => o.id !== id); 
        saveToLocalStorage('adminOrders', orders); 
        renderOrderList(); 
        alert(`Đơn hàng ${id} đã được xóa thành công.`);
    }
};

const renderCustomerList = () => {
    const el = document.getElementById('customer-list');
    el.innerHTML = '';
    const map = new Map();
    orders.forEach(o => {
        // Lấy thông tin khách hàng từ đơn hàng đã hoàn tất (Đã giao)
        if (o.status === 'Đã giao' || o.status === 'Đang xử lý') { 
            if (!map.has(o.phone)) {
                // Giả định email và phone là duy nhất
                map.set(o.phone, { id: Math.random().toString(36).substring(7).toUpperCase(), name: o.customer, email: o.email, phone: o.phone, totalSpent: o.total });
            } else {
                const c = map.get(o.phone);
                c.totalSpent += o.total;
            }
        }
    });
    map.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${c.id}</td><td>${c.name}</td><td>${c.email}</td><td>${c.phone}</td><td>${c.totalSpent.toLocaleString('vi-VN')} VNĐ</td>`;
        el.appendChild(row);
    });
};

// =================================================================
// 6. QUẢN LÝ KHO HÀNG (ĐÃ CẬP NHẬT CHỨC NĂNG CHỈNH SỬA)
// =================================================================
const renderInventoryList = () => {
    const el = document.getElementById('inventory-list');
    el.innerHTML = '';
    products.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.stock}</td>
            
            <td><input type="number" id="stock-${p.id}" value="${p.stock}" style="width: 80px;" min="0"></td>
            
            <td><input type="text" id="discount-${p.id}" value="${p.discount || ''}" style="width: 100%; min-width: 150px;"></td> 

            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="updateInventory(${p.id})">Cập nhật</button>
                </div>
            </td>
        `;
        el.appendChild(row);
    });
};

const updateInventory = (id) => {
    // Lấy giá trị tồn kho mới
    const newStockEl = document.getElementById(`stock-${id}`);
    const newStock = parseInt(newStockEl.value);

    // Lấy giá trị khuyến mãi mới
    const newDiscountEl = document.getElementById(`discount-${id}`);
    const newDiscount = newDiscountEl.value.trim();

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1 && !isNaN(newStock) && newStock >= 0) {
        // Cập nhật Tồn kho và Khuyến mãi
        products[productIndex].stock = newStock;
        products[productIndex].discount = newDiscount;
        
        // Lưu và đồng bộ
        saveToLocalStorage('adminProducts', products);
        
        alert(`Đã cập nhật kho hàng cho sản phẩm ${products[productIndex].name}.\n- Tồn kho: ${newStock}\n- Khuyến mãi: ${newDiscount || 'Không'}`);
        
        // Tải lại danh sách tồn kho sau khi cập nhật
        renderInventoryList();
    } else {
        alert("Giá trị Tồn kho không hợp lệ. Vui lòng nhập số nguyên không âm.");
        // Đặt lại giá trị cũ nếu nhập sai
        newStockEl.value = products[productIndex].stock; 
    }
};
function getReviewStats() {
    if (!reviews || reviews.length === 0) {
        return {
            total: 0,
            avg: 0,
            dist: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
    }

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach(r => {
        dist[r.rating] = (dist[r.rating] || 0) + 1;
        sum += r.rating;
    });

    return {
        total: reviews.length,
        avg: (sum / reviews.length).toFixed(2),
        dist
    };
}

// =================================================================
// 7. THỐNG KÊ DOANH THU & BÁO CÁO
// =================================================================
const renderDashboardStats = () => {
    const el = document.getElementById('stats-summary');
    el.innerHTML = '';

    // ---- Doanh thu ----
    const successOrders = orders.filter(o => o.status === 'Đã giao');
    const totalRev = successOrders.reduce((s, o) => s + o.total, 0);

    // ---- SP bán chạy ----
    const salesMap = new Map();
    successOrders.forEach(o => {
        o.items.forEach(it => {
            salesMap.set(it.name, (salesMap.get(it.name) || 0) + it.qty);
        });
    });

    let bestSeller = { name: "Chưa có", qty: 0 };
    salesMap.forEach((qty, name) => {
        if (qty > bestSeller.qty) bestSeller = { name, qty };
    });

    // ---- Thống kê đánh giá ----
    const rev = getReviewStats();

    const stats = [
        { title: 'Tổng Doanh Thu Đã Giao', value: `${totalRev.toLocaleString('vi-VN')} VNĐ` },
        { title: 'Tổng Đơn Hàng', value: orders.length },
        { title: 'Số Sản Phẩm', value: products.length },
        { title: 'Sản Phẩm Bán Chạy', value: `${bestSeller.name} (${bestSeller.qty} SP)` },
        { title: '📊 Tổng Đánh Giá', value: rev.total },
        { title: '⭐ Điểm Trung Bình', value: rev.avg }
    ];

    stats.forEach(s => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `<h4>${s.title}</h4><p>${s.value}</p>`;
        el.appendChild(card);
    });
};


function renderReviewList() {
    const tbody = document.getElementById("review-list");
    tbody.innerHTML = "";

    const pf = document.getElementById("review-product-filter").value;
    const sf = document.getElementById("review-star-filter").value;

    let filtered = [...reviews];

    if (pf !== "all") filtered = filtered.filter(r => r.productId == pf);
    if (sf !== "all") filtered = filtered.filter(r => r.rating == sf);

    filtered.forEach((r, index) => {
        const product = products.find(p => p.id == r.productId);
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product ? product.name : "Không xác định"}</td>
            <td>${r.name}</td>
            <td>${"⭐".repeat(r.rating)}</td>
            <td>${r.comment}</td>
            <td>${r.date ? new Date(r.date).toLocaleDateString("vi-VN") : ""}</td>
            <td>${r.images && r.images.length ? r.images.length + " ảnh" : "—"}</td>
            <td><button class="delete-btn" onclick="deleteReview(${index})">Xóa</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteReview(i) {
    if (!confirm("Xóa đánh giá này?")) return;
    reviews.splice(i, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    renderReviewList();
}

function loadReviewFilters() {
    const sel = document.getElementById("review-product-filter");
    sel.innerHTML = `<option value="all">Tất cả sản phẩm</option>` +
        products.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
}

// =================================================================
// 8. HÀM TIỆN ÍCH KHÁC
// =================================================================
const closeModal = (id) => {
    document.getElementById(id).style.display = 'none';
};