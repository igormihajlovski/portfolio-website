<?php

declare(strict_types=1);

/*
 * Prevent direct browser access.
 * contact.php must define CONTACT_FORM_APP before loading this file.
 */
if (!defined('CONTACT_FORM_APP')) {
    http_response_code(403);
    exit('Direct access is not allowed.');
}

/*
 * Cloudflare Turnstile
 *
 * Paste only the SECRET key here.
 * The Site key will later be added to index.html.
 */
const TURNSTILE_SECRET_KEY = '0x4AAAAAAEHLlZNiZG-dgpnanMOK5KnmSrU';

/*
 * Contact form recipient
 */
const CONTACT_RECIPIENT_EMAIL = 'igorn001@gmail.com';
const CONTACT_RECIPIENT_NAME = 'Igor Mihajlovski';

/*
 * Website details
 */
const WEBSITE_NAME = 'Igor Mihajlovski Portfolio';
const WEBSITE_URL = 'https://igormihajlovski.com';

/*
 * Email subject prefix
 */
const EMAIL_SUBJECT_PREFIX = '[Portfolio Contact Form]';

/*
 * Basic form limits
 */
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 5000;

/*
 * Turnstile verification endpoint
 */
const TURNSTILE_VERIFY_URL =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';
