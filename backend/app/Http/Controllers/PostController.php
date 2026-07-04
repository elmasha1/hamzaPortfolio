<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    /** GET /api/posts (public) — published posts, newest first. */
    public function index(): JsonResponse
    {
        $posts = \App\Support\PublicCache::remember('posts', function () {
            return Post::query()
                ->where('published', true)
                ->orderByDesc('published_at')
                ->get(['id', 'title', 'slug', 'cover', 'excerpt', 'tags', 'read_time', 'published_at']);
        });

        return response()->json(['data' => $posts]);
    }

    /** GET /api/posts/{post} (public) — a single published post by slug. */
    public function show(Post $post): JsonResponse
    {
        abort_unless($post->published, 404);

        return response()->json(['data' => $post]);
    }
}
