<?php

declare(strict_types=1);

define('CONTACT_FORM_APP', true);

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

function sendJsonResponse(
    bool $success,
    string $message,
    int $statusCode = 200
): never {
    http_response_code($statusCode);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message,
        ],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    exit;
}

function getPostValue(string $key): string
{
    $value = $_POST[$key] ?? '';

    return is_string($value) ? trim($value) : '';
}

function getStringLength(string $value): int
{
    return function_exists('mb_strlen')
        ? mb_strlen($value, 'UTF-8')
        : strlen($value);
}

function verifyTurnstileToken(string $token, string $remoteIp): bool
{
    $payload = [
        'secret' => TURNSTILE_SECRET_KEY,
        'response' => $token,
        'remoteip' => $remoteIp,
    ];

    if (function_exists('curl_init')) {
        $curl = curl_init(TURNSTILE_VERIFY_URL);

        if ($curl === false) {
            return false;
        }

        curl_setopt_array(
            $curl,
            [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => http_build_query($payload),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_TIMEOUT => 15,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/x-www-form-urlencoded',
                ],
            ]
        );

        $response = curl_exec($curl);
        $httpCode = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);

        curl_close($curl);

        if (!is_string($response) || $httpCode !== 200) {
            return false;
        }
    } else {
        $context = stream_context_create(
            [
                'http' => [
                    'method' => 'POST',
                    'header' =>
                        "Content-Type: application/x-www-form-urlencoded\r\n",
                    'content' => http_build_query($payload),
                    'timeout' => 15,
                    'ignore_errors' => true,
                ],
            ]
        );

        $response = file_get_contents(
            TURNSTILE_VERIFY_URL,
            false,
            $context
        );

        if (!is_string($response)) {
            return false;
        }
    }

    $result = json_decode($response, true);

    return is_array($result)
        && isset($result['success'])
        && $result['success'] === true;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(
        false,
        'Method not allowed.',
        405
    );
}

/*
 * Honeypot field.
 * Real visitors leave this field empty.
 */
$website = getPostValue('website');

if ($website !== '') {
    sendJsonResponse(
        true,
        'Thank you. Your message has been sent.'
    );
}

$name = getPostValue('name');
$email = getPostValue('email');
$message = getPostValue('message');
$turnstileToken = getPostValue('cf-turnstile-response');

$nameLength = getStringLength($name);
$messageLength = getStringLength($message);

if (
    $nameLength < NAME_MIN_LENGTH
    || $nameLength > NAME_MAX_LENGTH
) {
    sendJsonResponse(
        false,
        'Please enter a valid name.',
        422
    );
}

if (
    !filter_var($email, FILTER_VALIDATE_EMAIL)
    || strlen($email) > 254
) {
    sendJsonResponse(
        false,
        'Please enter a valid email address.',
        422
    );
}

if (
    $messageLength < MESSAGE_MIN_LENGTH
    || $messageLength > MESSAGE_MAX_LENGTH
) {
    sendJsonResponse(
        false,
        'Please enter a message between 10 and 5000 characters.',
        422
    );
}

if ($turnstileToken === '') {
    sendJsonResponse(
        false,
        'Please complete the security check.',
        422
    );
}

$remoteIp = $_SERVER['REMOTE_ADDR'] ?? '';

if (!verifyTurnstileToken($turnstileToken, $remoteIp)) {
    sendJsonResponse(
        false,
        'Security verification failed. Please try again.',
        422
    );
}

/*
 * Prevent email-header injection.
 */
$safeName = str_replace(["\r", "\n"], ' ', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);

$subject = EMAIL_SUBJECT_PREFIX . ' New message from ' . $safeName;

$emailBody = implode(
    PHP_EOL,
    [
        'New portfolio contact-form message',
        '',
        'Name: ' . $safeName,
        'Email: ' . $safeEmail,
        '',
        'Message:',
        $message,
        '',
        'Website: ' . WEBSITE_URL,
        'IP address: ' . $remoteIp,
        'Sent at: ' . date('Y-m-d H:i:s T'),
    ]
);

/*
 * The sender uses your domain.
 * Reply-To points to the visitor's email address.
 */
$headers = [
    'From: ' . WEBSITE_NAME . ' <no-reply@igormihajlovski.com>',
    'Reply-To: ' . $safeName . ' <' . $safeEmail . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$emailSent = mail(
    CONTACT_RECIPIENT_EMAIL,
    $subject,
    $emailBody,
    implode("\r\n", $headers)
);

if (!$emailSent) {
    sendJsonResponse(
        false,
        'Your message could not be sent. Please try again later.',
        500
    );
}

sendJsonResponse(
    true,
    'Thank you. Your message has been sent successfully.'
);