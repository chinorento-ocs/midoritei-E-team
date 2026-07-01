<?php
header('Content-Type: application/json; charset=utf-8');

function setMenus($menuId, $menuName, $categoryName, $unitPrice, $taxRate) {
    require_once 'connection.php';

    $sql = "INSERT INTO menus (menuId, menuName, categoryName, unitPrice, taxRate, menuDescription) VALUES (:menuId, :menuName, :categoryName, :unitPrice, :taxRate, :menuDescription)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':menuId' => $menuId,
        ':menuName' => $menuName,
        ':categoryName' => $categoryName,
        ':unitPrice' => $unitPrice,
        ':taxRate' => $taxRate,
    ]);
}

function getMenus() {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT * FROM menus");
    $stmt->execute();
    $menusData = $stmt->fetchAll();

    return $menusData;
}

function getMenuData($menuId) {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT * FROM menus WHERE menuId = :menuId");
    $stmt->execute([
        ':menuId' => $menuId
    ]);
    $menuData = $stmt->fetchAll();

    return $menuData;
}
function setPhotoPath($menuId, $photoPath) {
    require_once 'connection.php';

    $sql = "UPDATE menus SET photoPath = :photoPath WHERE menuId = :menuId";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':menuId' => $menuId,
        ':photoPath' => $photoPath
    ]);
}
function updateStatus($menuId, $status) {
    require_once 'connection.php';

    $sql = "UPDATE menus SET status = :status WHERE menuId = :menuId";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':status' => $status
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT menuId, menuName, categoryName, unitPrice, taxRate, status FROM menus");
    $stmt->execute();
    $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($menus, JSON_UNESCAPED_UNICODE);
    exit;
}
?>