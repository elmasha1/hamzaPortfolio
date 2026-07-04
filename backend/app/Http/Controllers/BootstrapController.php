<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

class BootstrapController extends Controller
{
    /**
     * GET /api/bootstrap (public)
     *
     * One consolidated payload with everything the public site needs on load —
     * instead of the frontend firing 5–6 separate requests (each paying a full
     * framework boot on the single-threaded dev server). Cached as one blob and
     * invalidated by any dashboard write.
     */
    public function index(): JsonResponse
    {
        $data = PublicCache::remember('bootstrap', fn () => [
            'settings' => Setting::map(),
            'projects' => ProjectController::payload(),
            'journey' => JourneyController::payload(),
            'technologies' => TechnologyController::payload(),
            'pricing' => PricingController::payload(),
            'about' => AboutController::payload(),
        ]);

        return response()->json(['data' => $data]);
    }
}
