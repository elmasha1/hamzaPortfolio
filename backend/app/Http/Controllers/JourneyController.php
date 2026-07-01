<?php

namespace App\Http\Controllers;

use App\Models\JourneyMilestone;
use Illuminate\Http\JsonResponse;

class JourneyController extends Controller
{
    /** GET /api/journey (public) — milestones in display order. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => JourneyMilestone::orderBy('order')->orderBy('id')->get(),
        ]);
    }
}
