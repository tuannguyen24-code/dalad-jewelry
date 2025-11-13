<?php
// Thiết lập header cho phép truy cập từ mọi domain (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PATCH");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$orders_file = 'orders.json';

// Xử lý yêu cầu OPTIONS (kiểm tra trước khi gửi POST/PATCH)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Hàm đọc tất cả đơn hàng từ file
function readOrders($file) {
    if (file_exists($file)) {
        $content = file_get_contents($file);
        // Trả về mảng rỗng nếu file rỗng hoặc không phải JSON hợp lệ
        $orders = json_decode($content, true);
        return $orders === null ? [] : $orders;
    }
    return [];
}

// Hàm ghi tất cả đơn hàng vào file
function writeOrders($file, $orders) {
    // Thêm cờ JSON_UNESCAPED_UNICODE để hiển thị tiếng Việt không bị mã hóa
    return file_put_contents($file, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// =================================================================
// CHỨC NĂNG 1: LẤY DANH SÁCH ĐƠN HÀNG (GET) - Cho Admin Panel
// =================================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $current_orders = readOrders($orders_file);
    echo json_encode($current_orders, JSON_UNESCAPED_UNICODE);
    exit();
}

// =================================================================
// CHỨC NĂNG 2: CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (PATCH) - Cho Admin Panel
// =================================================================
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $json_data = file_get_contents("php://input");
    $update_data = json_decode($json_data, true);

    $order_id = $update_data['order_id'] ?? null;
    $new_status = $update_data['new_status'] ?? null;

    if (!$order_id || !$new_status) {
        http_response_code(400);
        echo json_encode(["message" => "Thiếu ID đơn hàng hoặc trạng thái mới."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $current_orders = readOrders($orders_file);
    $found = false;

    // Tìm và cập nhật trạng thái
    foreach ($current_orders as $key => $order) {
        if (($order['id'] ?? '') === $order_id) {
            $current_orders[$key]['admin_status'] = $new_status;
            $current_orders[$key]['updated_at'] = date('Y-m-d H:i:s');
            $found = true;
            break;
        }
    }

    if ($found) {
        if (writeOrders($orders_file, $current_orders)) {
            http_response_code(200); // OK
            echo json_encode(["message" => "Cập nhật trạng thái thành công.", "id" => $order_id, "status" => $new_status], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi server: Không thể ghi file orders.json (Kiểm tra quyền ghi)."], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Không tìm thấy đơn hàng có ID: $order_id."], JSON_UNESCAPED_UNICODE);
    }
    exit();
}


// =================================================================
// CHỨC NĂNG 3: NHẬN ĐƠN HÀNG MỚI (POST) - Từ index.html
// =================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents("php://input");
    $order_data = json_decode($json_data, true);

    if (empty($order_data)) {
        http_response_code(400);
        echo json_encode(["message" => "Thiếu dữ liệu đơn hàng."], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    $current_orders = readOrders($orders_file);

    // Gán thông tin Backend/Admin cho đơn hàng
    $order_id = uniqid('ORD');
    $order_data['id'] = $order_id;
    $order_data['admin_status'] = 'Chờ Xử Lý'; // Trạng thái Admin mặc định
    $order_data['created_at'] = date('Y-m-d H:i:s'); 

    // Thêm đơn hàng mới và lưu lại
    $current_orders[] = $order_data;

    if (writeOrders($orders_file, $current_orders)) {
        http_response_code(201); // Created
        echo json_encode(["message" => "Đơn hàng đã được lưu.", "order_id" => $order_id], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Lỗi server: Không thể ghi file orders.json (Kiểm tra quyền ghi)."], JSON_UNESCAPED_UNICODE);
    }
}
?>