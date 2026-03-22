<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'error' => 'method_not_allowed',
    ]);
    exit;
}

$action = isset($_GET['action']) ? (string) $_GET['action'] : '';
$projectId = getenv('SANITY_PROJECT_ID') ?: 'tl4n7qut';
$dataset = getenv('SANITY_DATASET') ?: 'production';
$apiVersion = getenv('SANITY_API_VERSION') ?: '2024-03-13';
$token = getenv('SANITY_READ_TOKEN');

if (!$token) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'missing_sanity_token',
    ]);
    exit;
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
            http_response_code(400);
            echo json_encode([
                'ok' => false,
                'error' => 'invalid_project_id',
            ]);
            exit;
        }

        $query = '*[_type == "project" && id == $projectId][0]';
        $params['$projectId'] = json_encode($requestedId, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        break;

    default:
        http_response_code(400);
        echo json_encode([
            'ok' => false,
            'error' => 'invalid_action',
        ]);
        exit;
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
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'sanity_request_failed',
    ]);
    exit;
}

$decoded = json_decode($response, true);
if (!is_array($decoded) || !array_key_exists('result', $decoded)) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'invalid_sanity_response',
    ]);
    exit;
}

echo json_encode([
    'ok' => true,
    'result' => $decoded['result'],
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
