<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    /** The public projects list (featured first, then manual order, then newest). */
    public static function payload()
    {
        return Project::orderByDesc('featured')->orderBy('order')->latest()->get();
    }

    /** GET /api/projects (public). */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => PublicCache::remember('projects', fn () => self::payload()),
        ]);
    }

    /** GET /api/projects/{project} (public) — a single project / case study. */
    public function show(Project $project): JsonResponse
    {
        return response()->json(['data' => $project]);
    }
}
