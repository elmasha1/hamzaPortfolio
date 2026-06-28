<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CvController as PublicCvController;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CvController extends Controller
{
    /** GET /api/admin/cv — current CV (merged with defaults) for the editor. */
    public function show(): JsonResponse
    {
        return response()->json(['data' => PublicCvController::payload()]);
    }

    /**
     * PUT /api/admin/cv — save the whole CV object.
     * The photo reuses the dashboard `profile_photo` setting.
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'cv' => ['required', 'array'],
            'cv.name' => ['nullable', 'string', 'max:120'],
            'cv.role' => ['nullable', 'string', 'max:120'],
            'cv.email' => ['nullable', 'string', 'max:160'],
            'cv.github' => ['nullable', 'string', 'max:255'],
            'cv.location' => ['nullable', 'string', 'max:120'],
            'cv.summary' => ['nullable', 'string', 'max:2000'],
            'cv.experiences' => ['nullable', 'array'],
            'cv.education' => ['nullable', 'array'],
            'cv.skills' => ['nullable', 'array'],
            'cv.skills.*' => ['string', 'max:40'],
            'cv.languages' => ['nullable', 'array'],
            'cv.certifications' => ['nullable', 'array'],
            'profile_photo' => ['nullable', 'string', 'max:1000'],
        ]);

        // Persist the photo separately so it stays in sync with the hero slot.
        $cv = $data['cv'];
        unset($cv['photo']); // photo is derived from profile_photo, never stored in cv
        Setting::put('cv', $cv);

        if ($request->has('profile_photo')) {
            Setting::put('profile_photo', $data['profile_photo'] ?? '');
        }

        return response()->json([
            'message' => 'CV saved.',
            'data' => PublicCvController::payload(),
        ]);
    }
}
