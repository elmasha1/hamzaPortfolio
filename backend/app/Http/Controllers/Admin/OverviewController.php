<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JourneyMilestone;
use App\Models\Message;
use App\Models\Post;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class OverviewController extends Controller
{
    /**
     * GET /api/admin/overview — everything the dashboard landing page needs in
     * ONE request: counts + the 5 most recent messages (lean columns only),
     * instead of downloading every message and every project for 3 numbers.
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'counts' => [
                    'messages' => Message::count(),
                    'unread' => Message::where('read', false)->count(),
                    'projects' => Project::count(),
                    'posts' => Post::count(),
                    'milestones' => JourneyMilestone::count(),
                ],
                'recent_messages' => Message::latest()
                    ->limit(5)
                    ->get(['id', 'name', 'email', 'message', 'read', 'created_at']),
            ],
        ]);
    }
}
