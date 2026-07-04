<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\TechnologyController as PublicTechnologyController;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TechnologyController extends Controller
{
    /** GET /api/admin/technologies. */
    public function show(): JsonResponse
    {
        $groups = Setting::get('tech_groups');

        return response()->json([
            'data' => $groups ? PublicTechnologyController::normalize($groups) : PublicTechnologyController::DEFAULTS,
        ]);
    }

    /** PUT /api/admin/technologies — save the whole grouped stack. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'groups' => ['present', 'array'],
            'groups.*.label' => ['nullable', 'string', 'max:60'],
            'groups.*.items' => ['nullable', 'array'],
            'groups.*.items.*.name' => ['nullable', 'string', 'max:60'],
            'groups.*.items.*.icon' => ['nullable', 'string', 'max:40'],
        ]);

        Setting::put('tech_groups', $data['groups']);

        return response()->json(['data' => $data['groups']]);
    }
}
