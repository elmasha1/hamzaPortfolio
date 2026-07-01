<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    /**
     * GET /api/projects (public)
     * Return projects for the portfolio grid: featured first, then by the
     * manual `order` set in the dashboard, then newest.
     */
    public function index(): JsonResponse
    {
        $projects = Project::orderByDesc('featured')
            ->orderBy('order')
            ->latest()
            ->get();

        return response()->json(['data' => $projects]);
    }

    /** GET /api/projects/{project} (public) — a single project / case study. */
    public function show(Project $project): JsonResponse
    {
        return response()->json(['data' => $project]);
    }
}
