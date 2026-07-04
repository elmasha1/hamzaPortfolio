<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Cache;

/**
 * PublicCache — response caching for the public read-only API.
 *
 * Uses a single version number in the cache key: bumping the version (on any
 * dashboard write) instantly invalidates every public entry without having to
 * enumerate keys. Pinned to the `file` store so it works regardless of the
 * configured default (the project has no cache DB table).
 */
class PublicCache
{
    private const VERSION_KEY = 'public-cache-version';
    private const TTL = 300; // 5 minutes

    /** Remember a public payload under the current cache version. */
    public static function remember(string $key, Closure $fn)
    {
        $store = Cache::store('file');
        $version = (int) $store->get(self::VERSION_KEY, 1);

        return $store->remember("public:v{$version}:{$key}", self::TTL, $fn);
    }

    /** Invalidate ALL public cache entries (called after dashboard writes). */
    public static function bust(): void
    {
        $store = Cache::store('file');
        $store->put(self::VERSION_KEY, (int) $store->get(self::VERSION_KEY, 1) + 1);
    }
}
