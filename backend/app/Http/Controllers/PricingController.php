<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class PricingController extends Controller
{
    /** Defaults so the page renders before anything is edited. */
    public const DEFAULTS = [
        'heading' => 'Simple, transparent pricing.',
        'subline' => 'Clear scope, clear price, no surprises. Every project starts with a conversation.',
        'note' => 'Prices exclude VAT. Monthly maintenance & support retainers available on request.',
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
