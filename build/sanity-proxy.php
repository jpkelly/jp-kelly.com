<?php

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function send_json($statusCode, $payload)
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(405, [
        'ok' => false,
        'error' => 'method_not_allowed',
    ]);
}

$action = isset($_GET['action']) ? (string) $_GET['action'] : '';
$projectId = getenv('SANITY_PROJECT_ID') ?: 'tl4n7qut';
$dataset = getenv('SANITY_DATASET') ?: 'production';
$apiVersion = getenv('SANITY_API_VERSION') ?: '2024-03-13';
$token = getenv('SANITY_READ_TOKEN');

if (!$token) {
    send_json(500, [
        'ok' => false,
        'error' => 'missing_sanity_token',
    ]);
}

$query = '';
$params = [];

switch ($action) {
    case 'about':
        $query = '*[_type == "aboutPage"][0]';
        break;

    case 'projects':
        $query = '*[_type == "project"] | order(order asc)';
        break;

    case 'projectById':
        $requestedId = isset($_GET['projectId']) ? (string) $_GET['projectId'] : '';
        if (!preg_match('/^[a-zA-Z0-9_-]+$/', $requestedId)) {
            send_json(400, [
                'ok' => false,
                'error' => 'invalid_project_id',
            ]);
        }

        $query = '*[_type == "project" && id == $projectId][0]';
        $params['$projectId'] = json_encode($requestedId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    default:
        send_json(400, [
            'ok' => false,
            'error' => 'invalid_action',
        ]);
}

$baseUrl = sprintf(
    'https://%s.api.sanity.io/v%s/data/query/%s',
    rawurlencode($projectId),
    rawurlencode($apiVersion),
    rawurlencode($dataset)
);

$queryString = http_build_query(array_merge([
    'query' => $query,
], $params));

$endpoint = $baseUrl . '?' . $queryString;

$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'timeout' => 10,
        'header' => [
            'Accept: application/json',
            'Authorization: Bearer ' . $token,
        ],
    ],
]);

$response = @file_get_contents($endpoint, false, $context);

if ($response === false) {
    send_json(502, [
        'ok' => false,
        'error' => 'sanity_request_failed',
    ]);
}

$decoded = json_decode($response, true);
if (!is_array($decoded) || !array_key_exists('result', $decoded)) {
    send_json(502, [
        'ok' => false,
        'error' => 'invalid_sanity_response',
    ]);
}

send_json(200, [
    'ok' => true,
    'result' => $decoded['result'],
]);
