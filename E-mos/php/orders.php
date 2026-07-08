<?php
header('Content-Type: application/json; charset=utf-8');

function setOrders($orderId, $customerId, $storeId, $orderTime, $status, $hash){
    require_once 'connection.php';

    $sql = "INSERT INTO orders (orderId, customerId, storeId, orderTime, status, hash) VALUES (:orderId, :customerId, :storeId, :orderTime, :status, :hash)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':orderId' => $orderId,
        ':customerId' => $customerId,
        ':storeId' => $storeId,
        ':orderTime' => $orderTime,
        ':status' => $status,
    ]);
}

// 卓番からカスタマーIDを取得（seats テーブルと users テーブルの関連付け）
function getCustomerIdBySeatId($seatId) {
    require_once 'connection.php';

    $sql = "SELECT customerId FROM users WHERE seatId = :seatId LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':seatId' => $seatId]);
    $result = $stmt->fetch();
    return $result ? $result['customerId'] : null;
}

// 顧客IDから注文情報を取得
function getOrdersByCustomerId($customerId) {
    require_once 'connection.php';

    $sql = "SELECT o.orderId, i.menuId, m.menuName, i.orderQty, COALESCE(i.orderQty, 0) as servedQty 
            FROM orders o 
            LEFT JOIN invoices i ON o.orderId = i.orderId 
            LEFT JOIN menus m ON i.menuId = m.menuId 
            WHERE o.customerId = :customerId AND o.status = 0";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':customerId' => $customerId]);
    return $stmt->fetchAll();
}

// 注文キャンセル
function cancelOrderItem($orderId, $menuId, $cancelQty) {
    require_once 'connection.php';

    $sql = "UPDATE invoices SET orderQty = orderQty - :cancelQty WHERE orderId = :orderId AND menuId = :menuId";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':orderId' => $orderId,
        ':menuId' => $menuId,
        ':cancelQty' => $cancelQty
    ]);
}

// 配膳数を更新
function updateServedQty($orderId, $menuId, $servedQty) {
    require_once 'connection.php';

    // 実装はテーブル構造に応じて調整
    // 現在のテーブルに servedQty カラムがあるか確認が必要
    $sql = "UPDATE invoices SET servedQty = :servedQty WHERE orderId = :orderId AND menuId = :menuId";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':orderId' => $orderId,
        ':menuId' => $menuId,
        ':servedQty' => $servedQty
    ]);
}

// 全使用中の卓を取得
function getAllActiveSeatIds() {
    require_once 'connection.php';

    $sql = "SELECT DISTINCT seatId FROM users WHERE seatId IS NOT NULL ORDER BY seatId ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    return $stmt->fetchAll();
}


// API処理
$action = $_POST['action'] ?? $_GET['action'] ?? null;

if ($action === 'getOrdersByCustomer') {
    $customerId = $_POST['customerId'] ?? $_GET['customerId'] ?? null;
    
    if (!$customerId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'customerId is required']);
        exit;
    }
    
    try {
        $orders = getOrdersByCustomerId($customerId);
        echo json_encode(['success' => true, 'data' => $orders]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} elseif ($action === 'getCustomerIdBySeat') {
    $seatId = $_POST['seatId'] ?? $_GET['seatId'] ?? null;
    
    if (!$seatId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'seatId is required']);
        exit;
    }
    
    try {
        $customerId = getCustomerIdBySeatId($seatId);
        if ($customerId) {
            echo json_encode(['success' => true, 'customerId' => $customerId]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Customer not found']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} elseif ($action === 'cancelItem') {
    $orderId = $_POST['orderId'] ?? null;
    $menuId = $_POST['menuId'] ?? null;
    $cancelQty = $_POST['cancelQty'] ?? null;
    
    if (!$orderId || !$menuId || !$cancelQty) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
        exit;
    }
    
    try {
        cancelOrderItem($orderId, $menuId, $cancelQty);
        echo json_encode(['success' => true, 'message' => 'Item cancelled']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} elseif ($action === 'updateServed') {
    $orderId = $_POST['orderId'] ?? null;
    $menuId = $_POST['menuId'] ?? null;
    $servedQty = $_POST['servedQty'] ?? null;
    
    if (!$orderId || !$menuId || $servedQty === null) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required parameters']);
        exit;
    }
    
    try {
        updateServedQty($orderId, $menuId, $servedQty);
        echo json_encode(['success' => true, 'message' => 'Served qty updated']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} elseif ($action === 'getAllActiveSeat') {
    // 全使用中の卓を取得
    try {
        $seats = getAllActiveSeatIds();
        echo json_encode(['success' => true, 'data' => $seats]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    // アクションがない場合、古い機能と互換性を保つ
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid action']);
}
?>
