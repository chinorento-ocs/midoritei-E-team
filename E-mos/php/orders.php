<?php
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
?>