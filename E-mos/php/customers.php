<?php

function setCustomers($customerId, $seatId, $entryTime, $headcountAdult, $headcountYoung) {
    require_once 'connection.php';

    $sql = "INSERT INTO users (customerId,seatId,entryTime,headcountAdult, headcountYoung) VALUES (:customerId, :seatId, :entryTime, :headcountAdult, :headcountYoung)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
    ':customerId' => $customerId,
    ':seatId' => $seatId,
    ':entryTime' => $entryTime,
    ':headcountAdult' => $headcountAdult,
    ':headcountYoung' => $headcountYoung
    ]);
echo "登録完了";
}

function getCustomerData($customerId) {
    require_once 'connection.php';

    $stmt = $pdo->query("SELECT * FROM users WHERE customerId = :customerId");
    $stmt->bindParam(':customerId', $customerId);
    $customerData = $stmt->fetchAll();

    return $customerData;
}




