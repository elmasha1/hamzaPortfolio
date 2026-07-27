<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

/**
 * Cloudinary uploads over the signed REST API — no SDK, no extra dependency.
 *
 * Why Cloudinary at all: on Railway (and most container hosts) the filesystem
 * is ephemeral, so anything written to storage/app/public disappears on the
 * next deploy. Media has to live somewhere else, and Cloudinary also gives us
 * the delivery-side transformations the frontend leans on — f_auto/q_auto,
 * width variants for srcset, and a poster frame derived from a video.
 *
 * Nothing here is required: when CLOUDINARY_URL is unset, `enabled()` is false
 * and every caller falls back to the local public disk exactly as before.
 */
class Cloudinary
{
    public static function enabled(): bool
    {
        return (bool) (config('cloudinary.cloud_name')
            && config('cloudinary.api_key')
            && config('cloudinary.api_secret'));
    }

    /**
     * Upload a file and return its secure URL, or null on failure.
     *
     * @param  string  $folder  sub-folder under the configured root ('projects', 'profile', 'videos')
     * @param  string  $type    'image' | 'video'
     */
    public static function upload(UploadedFile $file, string $folder, string $type = 'image'): ?string
    {
        if (! self::enabled()) {
            return null;
        }

        $params = [
            'folder' => trim(config('cloudinary.folder'), '/').'/'.$folder,
            'timestamp' => (string) time(),
            // Overwriting is off and the public_id is unique per upload, so a
            // replaced asset gets a new URL — no CDN cache to bust.
            'public_id' => $folder.'-'.now()->format('YmdHis').'-'.substr(md5(uniqid('', true)), 0, 6),
        ];

        $response = Http::timeout(120)
            ->attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
            ->post(self::endpoint($type, 'upload'), $params + [
                'api_key' => config('cloudinary.api_key'),
                'signature' => self::sign($params),
            ]);

        if (! $response->successful()) {
            Log::warning('Cloudinary upload failed', [
                'status' => $response->status(),
                'body' => $response->json('error.message') ?? $response->body(),
            ]);

            return null;
        }

        return $response->json('secure_url');
    }

    /**
     * Delete a previously uploaded asset, identified by its delivery URL.
     * Silently ignores URLs that aren't ours (an externally hosted file).
     */
    public static function destroy(?string $url, string $type = 'image'): void
    {
        $publicId = self::publicIdFromUrl($url);
        if (! $publicId || ! self::enabled()) {
            return;
        }

        $params = ['public_id' => $publicId, 'timestamp' => (string) time()];

        Http::timeout(30)->asForm()->post(self::endpoint($type, 'destroy'), $params + [
            'api_key' => config('cloudinary.api_key'),
            'signature' => self::sign($params),
        ]);
    }

    /**
     * Extract the public_id from a delivery URL:
     *   https://res.cloudinary.com/<cloud>/image/upload/v123/portfolio/projects/x.webp
     *   → portfolio/projects/x
     */
    public static function publicIdFromUrl(?string $url): ?string
    {
        if (! $url || ! str_contains($url, 'res.cloudinary.com/')) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH) ?: '';
        // Shape: /<cloud>/<type>/upload/[optional transformations]/v<version>/<public_id>.<ext>
        if (! preg_match('#/upload/(?:[^/]+/)*?v\d+/(.+)$#', $path, $m)) {
            return null;
        }

        return preg_replace('/\.[a-z0-9]+$/i', '', $m[1]);
    }

    /* ----------------------------- internals ----------------------------- */

    private static function endpoint(string $type, string $action): string
    {
        return sprintf(
            'https://api.cloudinary.com/v1_1/%s/%s/%s',
            config('cloudinary.cloud_name'),
            $type === 'video' ? 'video' : 'image',
            $action
        );
    }

    /** Cloudinary's signature: sorted `k=v` pairs, joined by &, + the secret. */
    private static function sign(array $params): string
    {
        ksort($params);
        $query = urldecode(http_build_query($params));

        return sha1($query.config('cloudinary.api_secret'));
    }

    /**
     * Delete whichever backend actually holds the file — Cloudinary for
     * remote URLs, the public disk for anything we stored locally before the
     * account existed.
     */
    public static function forget(?string $url, string $localPrefix, string $type = 'image'): void
    {
        if (! $url) {
            return;
        }

        if (str_contains($url, 'res.cloudinary.com/')) {
            self::destroy($url, $type);

            return;
        }

        if (str_contains($url, "/storage/{$localPrefix}/")) {
            Storage::disk('public')->delete($localPrefix.'/'.basename(parse_url($url, PHP_URL_PATH)));
        }
    }
}
