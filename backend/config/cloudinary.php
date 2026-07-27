<?php

/**
 * Cloudinary credentials, parsed from the single CLOUDINARY_URL that
 * Cloudinary hands you:
 *
 *   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
 *
 * Leaving it unset is a supported state: every uploader falls back to the
 * local public disk, so development and a self-hosted deploy keep working
 * without an account.
 */
$url = env('CLOUDINARY_URL');
$parts = $url ? parse_url($url) : false;

return [
    'cloud_name' => $parts['host'] ?? env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => $parts['user'] ?? env('CLOUDINARY_API_KEY'),
    'api_secret' => $parts['pass'] ?? env('CLOUDINARY_API_SECRET'),

    /*
     * Everything is uploaded under this folder, so one Cloudinary account can
     * host several sites without the media colliding.
     */
    'folder' => env('CLOUDINARY_FOLDER', 'portfolio'),
];
