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
            'cv.role' => ['nullable', 'string', 'max:160'],
            'cv.tagline' => ['nullable', 'string', 'max:300'],
            'cv.email' => ['nullable', 'string', 'max:160'],
            'cv.phone' => ['nullable', 'string', 'max:60'],
            'cv.github' => ['nullable', 'string', 'max:255'],
            'cv.linkedin' => ['nullable', 'string', 'max:255'],
            'cv.website' => ['nullable', 'string', 'max:255'],
            'cv.location' => ['nullable', 'string', 'max:120'],
            'cv.summary' => ['nullable', 'string', 'max:2000'],
            'cv.experiences' => ['nullable', 'array'],
            'cv.education' => ['nullable', 'array'],
            'cv.skills' => ['nullable', 'array'],
            'cv.skills.*' => ['string', 'max:40'],
            'cv.skill_groups' => ['nullable', 'array'],
            'cv.skill_groups.*.label' => ['nullable', 'string', 'max:60'],
            'cv.skill_groups.*.items' => ['nullable', 'array'],
            'cv.skill_groups.*.items.*' => ['string', 'max:40'],
            'cv.projects' => ['nullable', 'array'],
            'cv.projects.*.name' => ['nullable', 'string', 'max:120'],
            'cv.projects.*.description' => ['nullable', 'string', 'max:400'],
            'cv.projects.*.tech' => ['nullable', 'string', 'max:200'],
            'cv.projects.*.link' => ['nullable', 'string', 'max:255'],
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
