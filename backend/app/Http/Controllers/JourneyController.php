<?php

namespace App\Http\Controllers;

use App\Models\JourneyMilestone;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

class JourneyController extends Controller
{
    /** Milestones in display order. */
    public static function payload()
    {
        return JourneyMilestone::orderBy('order')->orderBy('id')->get();
    }

    /** GET /api/journey (public). */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => PublicCache::remember('journey', fn () => self::payload()),
        ]);
    }
}
