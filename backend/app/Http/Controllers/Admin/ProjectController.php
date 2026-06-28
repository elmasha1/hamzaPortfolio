<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /** GET /api/admin/projects — all projects in display order. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Project::orderByDesc('featured')->orderBy('order')->latest()->get(),
        ]);
    }

    /** POST /api/admin/projects — create (supports multipart image upload). */
    public function store(Request $request): JsonResponse
    {
        $data = $this->validateData($request);
        $data['image'] = $this->resolveImage($request, null);

        $project = Project::create($data);

        return response()->json(['data' => $project], 201);
    }

    /** GET /api/admin/projects/{project}. */
    public function show(Project $project): JsonResponse
    {
        return response()->json(['data' => $project]);
    }

    /**
     * PUT/PATCH /api/admin/projects/{project} — update.
     * Note: send as POST with `_method=PUT` when uploading a new file.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        $data = $this->validateData($request);
        $data['image'] = $this->resolveImage($request, $project);

        $project->update($data);

        return response()->json(['data' => $project]);
    }

    /** DELETE /api/admin/projects/{project}. */
    public function destroy(Project $project): JsonResponse
    {
        $this->deleteStoredImage($project->image);
        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }

    /** POST /api/admin/projects/reorder — persist a new card order. */
    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:projects,id'],
        ]);

        foreach ($data['order'] as $position => $id) {
            Project::where('id', $id)->update(['order' => $position]);
        }

        return response()->json(['message' => 'Order updated.']);
    }

    /* ----------------------------- helpers ----------------------------- */

    private function validateData(Request $request): array
    {
        // tech_tags may arrive as a JSON string (multipart) or an array.
        if (is_string($request->input('tech_tags'))) {
            $decoded = json_decode($request->input('tech_tags'), true);
            $request->merge(['tech_tags' => is_array($decoded) ? $decoded : []]);
        }

        return $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string'],
            'tech_tags' => ['nullable', 'array'],
            'tech_tags.*' => ['string', 'max:40'],
            'live_url' => ['nullable', 'url', 'max:255'],
            'github_url' => ['nullable', 'url', 'max:255'],
            'featured' => ['boolean'],
            'order' => ['nullable', 'integer'],
            'role' => ['nullable', 'string', 'max:120'],
            // image is handled separately (file OR url string)
        ]);
    }

    /**
     * Returns the image URL to persist. Accepts either an uploaded file
     * (stored on the public disk) or a plain URL string.
     */
    private function resolveImage(Request $request, ?Project $project): ?string
    {
        if ($request->hasFile('image')) {
            $this->deleteStoredImage($project?->image);
            $path = $request->file('image')->store('projects', 'public');
            return Storage::disk('public')->url($path); // /storage/projects/xxx.jpg
        }

        // No new file: keep existing or accept a provided URL string.
        return $request->input('image', $project?->image);
    }

    private function deleteStoredImage(?string $url): void
    {
        if (! $url) {
            return;
        }
        // Only delete files we stored locally under /storage.
        if (str_contains($url, '/storage/projects/')) {
            $relative = 'projects/'.basename($url);
            Storage::disk('public')->delete($relative);
        }
    }
}
