<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * GET /api/settings (public)
     * Return all site settings as a flat map so the public React site can
     * render hero text, stats, WhatsApp number and social links dynamically.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => PublicCache::remember('settings', fn () => Setting::map()),
        ]);
    }
}
