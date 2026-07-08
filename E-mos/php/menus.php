<?php
header('Content-Type: application/json; charset=utf-8');

function setMenus($menuName, $categoryName, $unitPrice, $taxRate, $menuDescription = '') {
    require_once 'connection.php';

    $sql = "INSERT INTO menus (menuName, categoryName, unitPrice, taxRate, menuDescription) VALUES (:menuName, :categoryName, :unitPrice, :taxRate, :menuDescription)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':menuName' => $menuName,
        ':categoryName' => $categoryName,
        ':unitPrice' => $unitPrice,
        ':taxRate' => $taxRate,
        ':menuDescription' => $menuDescription,
    ]);
}

function updateMenus($menuId, $menuName, $categoryName, $unitPrice, $taxRate, $menuDescription = '') {
    require_once 'connection.php';

    $sql = "UPDATE menus SET menuName = :menuName, categoryName = :categoryName, unitPrice = :unitPrice, taxRate = :taxRate, menuDescription = :menuDescription WHERE menuId = :menuId";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':menuId' => $menuId,
        ':menuName' => $menuName,
        ':categoryName' => $categoryName,
        ':unitPrice' => $unitPrice,
        ':taxRate' => $taxRate,
        ':menuDescription' => $menuDescription,
    ]);
}

function deleteMenus($menuIds) {
    require_once 'connection.php';

    if (empty($menuIds)) {
        return;
    }

    $placeholders = implode(', ', array_fill(0, count($menuIds), '?'));
    $sql = "DELETE FROM menus WHERE menuId IN ($placeholders)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($menuIds);
}

function getMenus() {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT * FROM menus");
    $stmt->execute();
    return $stmt->fetchAll();
}

function getMenuData($menuId) {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT * FROM menus WHERE menuId = :menuId");
    $stmt->execute([':menuId' => $menuId]);
    return $stmt->fetchAll();
}

function setPhotoPath($menuId, $photoPath) {
    require_once 'connection.php';

    $sql = "UPDATE menus SET photoPath = :photoPath WHERE menuId = :menuId";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':menuId' => $menuId,
        ':photoPath' => $photoPath,
    ]);
}

function updateStatus($menuId, $status) {
    require_once 'connection.php';

    $sql = "UPDATE menus SET status = :status WHERE menuId = :menuId";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':menuId' => $menuId,
        ':status' => $status,
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        require_once 'connection.php';

        $stmt = $pdo->prepare("SELECT menuId, menuName, categoryName, unitPrice, taxRate, status FROM menus ORDER BY menuId ASC");
        $stmt->execute();
        $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($menus, JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '商品情報の取得に失敗しました。' . $e->getMessage()]);
        exit;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        require_once 'connection.php';

        $action = trim($_POST['action'] ?? 'create');
        $payload = $_POST['product'] ?? '';
        $productData = [];

        if ($payload !== '') {
            $decodedPayload = json_decode($payload, true);
            if (is_array($decodedPayload)) {
                $productData = $decodedPayload;
            }
        }

        if ($action === 'update') {
            $menuId = (int)($productData['id'] ?? ($_POST['id'] ?? 0));
            $menuName = trim($productData['name'] ?? ($_POST['name'] ?? ''));
            $categoryName = trim($productData['category'] ?? ($_POST['category'] ?? ''));
            $unitPrice = trim($productData['price'] ?? ($_POST['price'] ?? ''));
            $menuDescription = trim($productData['note'] ?? ($_POST['note'] ?? ''));
            $taxRate = isset($productData['taxRate']) ? trim($productData['taxRate']) : '0.1';
            $product = [
                'id' => $menuId,
                'name' => $menuName,
                'category' => $categoryName,
                'price' => $unitPrice,
                'note' => $menuDescription,
            ];

            if ($menuId <= 0 || $menuName === '' || $categoryName === '' || $unitPrice === '') {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => '必須項目を入力してください。', 'product' => $product]);
                exit;
            }

            updateMenus($menuId, $menuName, $categoryName, $unitPrice, $taxRate, $menuDescription);
            echo json_encode(['success' => true, 'message' => '更新しました。', 'product' => $product]);
            exit;
        }

        if ($action === 'delete') {
            $productIds = json_decode($_POST['productIds'] ?? '[]', true);
            if (!is_array($productIds)) {
                $productIds = [];
            }

            $menuIds = array_values(array_filter(array_map('intval', $productIds)));
            $product = ['ids' => $menuIds];
            if (empty($menuIds)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => '削除対象を選択してください。', 'product' => $product]);
                exit;
            }

            deleteMenus($menuIds);
            echo json_encode(['success' => true, 'message' => '削除しました。', 'product' => $product]);
            exit;
        }

        $menuName = trim($productData['name'] ?? ($_POST['name'] ?? ''));
        $categoryName = trim($productData['category'] ?? ($_POST['category'] ?? ''));
        $unitPrice = trim($productData['price'] ?? ($_POST['price'] ?? ''));
        $menuDescription = trim($productData['note'] ?? ($_POST['note'] ?? ''));
        $taxRate = isset($productData['taxRate']) ? trim($productData['taxRate']) : '0.1';
        $product = [
            'name' => $menuName,
            'category' => $categoryName,
            'price' => $unitPrice,
            'note' => $menuDescription,
        ];

        if ($menuName === '' || $categoryName === '' || $unitPrice === '') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => '必須項目を入力してください。', 'product' => $product]);
            exit;
        }

        setMenus($menuName, $categoryName, $unitPrice, $taxRate, $menuDescription);
        echo json_encode(['success' => true, 'message' => '登録しました。', 'product' => $product]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => '処理に失敗しました。' . $e->getMessage()]);
        exit;
    }
}
?>