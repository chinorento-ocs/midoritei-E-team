<?php
function setCallStaff($seatId, $time) {
    require_once 'connection.php';

    $sql = "INSERT INTO callstaff (seatId, time) VALUES (:seatId, :time)";
    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':seatId' => $seatId,
        ':time' => $time
    ]);
}

function getCallStaffData() {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT * FROM callstaff where status = 0");
    $stmt->execute();
    $callStaffData = $stmt->fetchAll();

    return $callStaffData;
}
?>