<?php
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
?>