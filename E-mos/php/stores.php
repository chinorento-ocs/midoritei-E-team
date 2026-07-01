<?php
function getStores($storeId) {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT * FROM stores WHERE storeId = :id");
    $stmt->bindParam(':id', $storeId, PDO::PARAM_INT);
    $stmt->execute();
    $stores = $stmt->fetchAll();

    return $stores;
}
?>