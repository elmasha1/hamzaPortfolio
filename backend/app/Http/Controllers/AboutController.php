<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class AboutController extends Controller
{
    /** Sensible defaults so the About page renders before anything is edited. */
    public const DEFAULTS = [
        'headline' => 'From idea to production — this is who I am.',
        'subline' => 'A full-stack engineer who cares as much about the craft as the outcome.',
        'video_url' => '',
        'video_poster' => '',
        'story' => [],
        'pull_quote' => '',
        'philosophy' => [],
        'facts' => [],
    ];

    /** The About payload (merged with defaults). */
    public static function payload(): array
    {
        $about = Setting::get('about');

        return is_array($about) ? array_merge(self::DEFAULTS, $about) : self::DEFAULTS;
    }

    /** GET /api/about (public) — the About page content. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Support\PublicCache::remember('about', fn () => self::payload()),
        ]);
    }
}
