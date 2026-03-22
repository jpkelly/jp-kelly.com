<?php

error_reporting(E_ALL);
ini_set('display_errors', '0');

function set_status_code($statusCode)
{
    $statusTexts = array(
        200 => 'OK',
        400 => 'Bad Request',
        405 => 'Method Not Allowed',
        500 => 'Internal Server Error',
        502 => 'Bad Gateway',
    );
    $protocol = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.1';
    $text = isset($statusTexts[$statusCode]) ? $statusTexts[$statusCode] : 'OK';
    header($protocol . ' ' . $statusCode . ' ' . $text, true, $statusCode);
}

function safe_json_encode($payload)
{
    $json = json_encode($payload);
    if ($json === false) {
        return '{"ok":false,"error":"json_encode_failed"}';
    }
    return $json;
}

function get_file_settings()
{
    static $loaded = false;
    static $settings = array();

    if ($loaded) {
        return $settings;
    }

    $loaded = true;
    $candidatePaths = get_secret_candidate_paths();

    foreach ($candidatePaths as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }

        $loadedSettings = include $path;
        if (is_array($loadedSettings)) {
            $settings = $loadedSettings;
            break;
        }
    }

    return $settings;
}

function get_secret_candidate_paths()
{
    return array(
        __DIR__ . '/sanity-proxy.secret.php',
        dirname(__DIR__) . '/sanity-proxy.secret.php',
    );
}

function read_setting($name, $defaultValue)
{
    $value = getenv($name);
    if ($value !== false && $value !== '') {
        return $value;
    }

    if (isset($_SERVER[$name]) && $_SERVER[$name] !== '') {
        return $_SERVER[$name];
    }

    if (isset($_ENV[$name]) && $_ENV[$name] !== '') {
        return $_ENV[$name];
    }

    $iniValue = ini_get($name);
    if ($iniValue !== false && $iniValue !== '') {
        return $iniValue;
    }

    $fileSettings = get_file_settings();
    if (isset($fileSettings[$name]) && $fileSettings[$name] !== '') {
        return $fileSettings[$name];
    }

    return $defaultValue;
}

function sanity_proxy_shutdown_handler()
{
    $lastError = error_get_last();
    if (!$lastError) {
        return;
    }

    $fatalTypes = array(1, 4, 16, 64, 256);
    if (!in_array($lastError['type'], $fatalTypes, true)) {
        return;
    }

    if (!headers_sent()) {
        set_status_code(500);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    }

    echo safe_json_encode(array(
        'ok' => false,
        'error' => 'php_fatal',
        'message' => $lastError['message'],
        'file' => basename($lastError['file']),
        'line' => $lastError['line'],
    ));
}

register_shutdown_function('sanity_proxy_shutdown_handler');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function send_json($statusCode, $payload)
{
    set_status_code($statusCode);
    echo safe_json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(405, [
        'ok' => false,
        'error' => 'method_not_allowed',
    ]);
}

$action = isset($_GET['action']) ? (string) $_GET['action'] : '';
$projectId = read_setting('SANITY_PROJECT_ID', 'tl4n7qut');
$dataset = read_setting('SANITY_DATASET', 'production');
$apiVersion = read_setting('SANITY_API_VERSION', '2024-03-13');
$token = read_setting('SANITY_READ_TOKEN', '');

if (!$token) {
    send_json(500, [
        'ok' => false,
        'error' => 'missing_sanity_token',
        'hint' => 'Set SANITY_READ_TOKEN in Plesk env vars or sanity-proxy.secret.php',
    ]);
}

$query = '';
$params = [];

switch ($action) {
    case 'debugPaths':
        $paths = get_secret_candidate_paths();
        $details = array();
        foreach ($paths as $path) {
            $details[] = array(
                'path' => $path,
                'exists' => is_file($path),
                'readable' => is_readable($path),
            );
        }
        send_json(200, array(
            'ok' => true,
            'phpVersion' => PHP_VERSION,
            'scriptDir' => __DIR__,
            'checkedPaths' => $details,
        ));
        break;

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
