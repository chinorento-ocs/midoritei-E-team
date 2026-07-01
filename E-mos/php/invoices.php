<?php
function setInvoices($orderId, $storeMenuId, $menuId, $orderQty, $priceSum) {
    require_once 'connection.php';

    $sql = "INSERT INTO invoices (orderId, storeMenuId, menuId, orderQty, priceSum, taxSum, totalSum) VALUES (:orderId, :storeMenuId, :menuId, :orderQty, :priceSum, :taxSum, :totalSum)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':orderId' => $orderId,
        ':storeMenuId' => $storeMenuId,
        ':menuId' => $menuId,
        ':orderQty' => $orderQty,
        ':priceSum' => $priceSum,
    ]);
}
?>