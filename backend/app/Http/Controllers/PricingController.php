<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class PricingController extends Controller
{
    /**
     * Defaults so the section renders before anything is edited.
     *
     * v2 renamed this section to "Ways to work together" and moved from three
     * pricing cards to three engagement rows (`rows`). `tiers` is kept so an
     * un-migrated dashboard still renders — the frontend maps the old shape
     * onto the new rows rather than showing an empty section.
     */
    public const DEFAULTS = [
        'heading' => 'Three ways this usually starts.',
        'subline' => 'Scope and price are set after a call, never before. The figures below are where projects like yours have typically landed.',
        'note' => 'Not sure which one this is? Write anyway — the first reply is a question, not a quote.',
        'rows' => [],
        'tiers' => [],
        'faq' => [],
    ];

    /** The pricing payload (merged with defaults). */
    public static function payload(): array
    {
        $pricing = Setting::get('pricing');

        return is_array($pricing) ? array_merge(self::DEFAULTS, $pricing) : self::DEFAULTS;
    }

    /** GET /api/pricing (public). */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Support\PublicCache::remember('pricing', fn () => self::payload()),
        ]);
    }
}
