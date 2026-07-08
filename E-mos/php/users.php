<?php
header('Content-Type: application/json; charset=utf-8');

function getusers($userId, $password) {
    require_once 'connection.php';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE userId = :userId AND password = :password");
    $stmt->execute([
        ':userId' => $userId,
        ':password' => $password
    ]);
    return $stmt->fetchAll();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $userId = trim($_POST['userId'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if ($userId === '' || $password === '') {
            http_response_code(400);
            echo json_encode(['success' => false]);
            exit;
        }

        $userData = getusers($userId, $password);
        echo json_encode(['success' => !empty($userData)]);
        exit;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false]);
        exit;
    }
}
?>