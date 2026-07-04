<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PricingController as PublicPricingController;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PricingController extends Controller
{
    /** GET /api/admin/pricing. */
    public function show(): JsonResponse
    {
        $pricing = Setting::get('pricing');

        return response()->json([
            'data' => is_array($pricing)
                ? array_merge(PublicPricingController::DEFAULTS, $pricing)
                : PublicPricingController::DEFAULTS,
        ]);
    }

    /** PUT /api/admin/pricing — persist the whole pricing payload. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'heading' => ['nullable', 'string', 'max:200'],
            'subline' => ['nullable', 'string', 'max:500'],
            'note' => ['nullable', 'string', 'max:500'],
            'tiers' => ['nullable', 'array'],
            'tiers.*.name' => ['nullable', 'string', 'max:120'],
            'tiers.*.price' => ['nullable', 'string', 'max:60'],
            'tiers.*.period' => ['nullable', 'string', 'max:60'],
            'tiers.*.description' => ['nullable', 'string', 'max:500'],
            'tiers.*.features' => ['nullable', 'array'],
            'tiers.*.features.*' => ['string', 'max:120'],
            'tiers.*.highlighted' => ['boolean'],
            'tiers.*.cta' => ['nullable', 'string', 'max:60'],
            'faq' => ['nullable', 'array'],
            'faq.*.q' => ['nullable', 'string', 'max:200'],
            'faq.*.a' => ['nullable', 'string', 'max:1000'],
        ]);

        Setting::put('pricing', $data);

        return response()->json(['data' => $data]);
    }
}
