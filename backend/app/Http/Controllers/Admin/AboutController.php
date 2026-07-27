<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    /** GET /api/admin/about. */
    public function show(): JsonResponse
    {
        return response()->json(['data' => Setting::get('about') ?: \App\Http\Controllers\AboutController::DEFAULTS]);
    }

    /** PUT /api/admin/about — persist the whole About payload. */
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'headline' => ['nullable', 'string', 'max:300'],
            'subline' => ['nullable', 'string', 'max:500'],
            'video_url' => ['nullable', 'string', 'max:1000'],
            'video_poster' => ['nullable', 'string', 'max:1000'],
            // Mono caption under the video, which now sits inside the story
            // as a figure rather than opening the page.
            'video_caption' => ['nullable', 'string', 'max:200'],
            'story' => ['nullable', 'array'],
            'story.*' => ['string', 'max:3000'],
            'pull_quote' => ['nullable', 'string', 'max:500'],
            'philosophy' => ['nullable', 'array'],
            'philosophy.*.title' => ['nullable', 'string', 'max:160'],
            'philosophy.*.description' => ['nullable', 'string', 'max:500'],
            'facts' => ['nullable', 'array'],
            'facts.*.label' => ['nullable', 'string', 'max:120'],
            'facts.*.value' => ['nullable', 'integer'],
            'facts.*.suffix' => ['nullable', 'string', 'max:8'],
            'facts.*.text' => ['nullable', 'string', 'max:120'],
        ]);

        Setting::put('about', $data);

        return response()->json(['data' => $data]);
    }
}
