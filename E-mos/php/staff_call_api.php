<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'connection.php';
require_once 'seats.php';
require_once 'callstaff.php';

$action = $_POST['action'] ?? $_GET['action'] ?? null;

if ($action === 'getSeatIds') {
    // 使用中の卓を取得
    try {
        $seatIds = getseatId();
        echo json_encode(['success' => true, 'data' => $seatIds]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} elseif ($action === 'callStaff') {
    // 店員呼び出しを記録
    $seatId = $_POST['seatId'] ?? null;
    
    if (!$seatId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '卓IDが必要です']);
        exit;
    }
    
    try {
        $time = date('Y-m-d H:i:s');
        setCallStaff($seatId, $time);
        echo json_encode(['success' => true, 'message' => '店員呼び出しを記録しました']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} elseif ($action === 'getCallStaffList') {
    // 保留中の店員呼び出しを取得（status=0）
    try {
        $callStaffData = getCallStaffData();
        echo json_encode(['success' => true, 'data' => $callStaffData]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => '不正なアクション']);
}
?>
