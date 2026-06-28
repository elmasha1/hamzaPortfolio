<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /** GET /api/admin/settings — all settings as a key => value map. */
    public function index(): JsonResponse
    {
        return response()->json(['data' => Setting::map()]);
    }

    /**
     * PUT /api/admin/settings — bulk upsert.
     * Body: { settings: { whatsapp_number: "...", hero_title: "...", ... } }
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
        ]);

        foreach ($data['settings'] as $key => $value) {
            Setting::put($key, $value);
        }

        return response()->json([
            'message' => 'Settings saved.',
            'data' => Setting::map(),
        ]);
    }
}
