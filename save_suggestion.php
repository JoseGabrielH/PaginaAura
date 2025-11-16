<?php
header('Content-Type: application/json');

// Obtener datos del cliente
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['type']) || !isset($data['suggestion'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$type = htmlspecialchars($data['type']);
$suggestion = htmlspecialchars($data['suggestion']);
$timestamp = htmlspecialchars($data['timestamp']);

// Validar tipo
if (!in_array($type, ['gain', 'lose'])) {
    echo json_encode(['success' => false, 'message' => 'Tipo inválido']);
    exit;
}

// Crear nombre del archivo
$filename = 'sugerencias_' . $type . '.txt';

// Crear contenido a guardar
$content = "[" . $timestamp . "] " . $suggestion . "\n";

// Guardar en archivo
if (file_put_contents($filename, $content, FILE_APPEND | LOCK_EX)) {
    echo json_encode(['success' => true, 'message' => 'Sugerencia guardada']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar']);
}
?>