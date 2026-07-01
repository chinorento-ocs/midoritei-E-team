<?php
function getseatId() {
    require_once 'connection.php';

    $stmt = $pdo->query("SELECT seatId FROM seats WHERE seatavailable = 0;");

    $seatIds = [];
    while ($row = $stmt->fetch()) {
        $seatIds[] = $row['seatId'];
    }

    return $seatIds;
}

function setSeatAvailable($seatId) {
    require_once 'connection.php';

    $stmt = $pdo->prepare("UPDATE seats SET seatavailable = 1 WHERE seatId = :seatId");
    $stmt->execute([
        ':seatId' => $seatId
    ]);
}