<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JourneyMilestone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JourneyController extends Controller
{
    /** GET /api/admin/journey. */
    public function index(): JsonResponse
    {
        return response()->json(['data' => JourneyMilestone::orderBy('order')->orderBy('id')->get()]);
    }

    /** POST /api/admin/journey. */
    public function store(Request $request): JsonResponse
    {
        $milestone = JourneyMilestone::create($this->validated($request, true));

        return response()->json(['data' => $milestone], 201);
    }

    /** GET /api/admin/journey/{milestone}. */
    public function show(JourneyMilestone $milestone): JsonResponse
    {
        return response()->json(['data' => $milestone]);
    }

    /** PUT/PATCH /api/admin/journey/{milestone}. */
    public function update(Request $request, JourneyMilestone $milestone): JsonResponse
    {
        $milestone->update($this->validated($request));

        return response()->json(['data' => $milestone]);
    }

    /** DELETE /api/admin/journey/{milestone}. */
    public function destroy(JourneyMilestone $milestone): JsonResponse
    {
        $milestone->delete();

        return response()->json(['message' => 'Milestone deleted.']);
    }

    /** POST /api/admin/journey/reorder — persist a new order. */
    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:journey_milestones,id'],
        ]);

        foreach ($data['order'] as $position => $id) {
            JourneyMilestone::where('id', $id)->update(['order' => $position]);
        }
        \App\Support\PublicCache::bust(); // query-builder updates skip model events

        return response()->json(['message' => 'Order updated.']);
    }

    /* ----------------------------- helpers ----------------------------- */

    private function validated(Request $request, bool $creating = false): array
    {
        if (is_string($request->input('tags'))) {
            $decoded = json_decode($request->input('tags'), true);
            $request->merge(['tags' => is_array($decoded) ? $decoded : array_values(array_filter(array_map('trim', explode(',', $request->input('tags')))))]);
        }

        $data = $request->validate([
            'date_label' => ['nullable', 'string', 'max:60'],
            // EDUCATION / INTERNSHIP / FREELANCE / PRODUCT — shown as a chip so
            // the mix of milestone types is legible at a glance.
            'kind' => ['nullable', 'string', 'max:40'],
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:2000'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:40'],
            'order' => ['nullable', 'integer'],
        ]);

        if ($creating && ! isset($data['order'])) {
            $data['order'] = (int) JourneyMilestone::max('order') + 1;
        }

        return $data;
    }
}
