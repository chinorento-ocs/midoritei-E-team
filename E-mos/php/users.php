<?php
function getusers($userId,$password) {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE userId = :userId AND password = :password");
    $stmt->execute([
        ':userId' => $userId,
        ':password' => $password
    ]);
    $userData = $stmt->fetchAll();

    return $userData;
}
?>