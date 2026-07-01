<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /** GET /api/admin/posts — all posts (published or not), newest first. */
    public function index(): JsonResponse
    {
        return response()->json(['data' => Post::orderByDesc('published_at')->latest()->get()]);
    }

    /** POST /api/admin/posts — create (supports multipart cover upload). */
    public function store(Request $request): JsonResponse
    {
        $data = $this->validateData($request);
        $data['cover'] = $this->resolveCover($request, null);

        $post = Post::create($data);

        return response()->json(['data' => $post], 201);
    }

    /** GET /api/admin/posts/{post}. */
    public function show(Post $post): JsonResponse
    {
        return response()->json(['data' => $post]);
    }

    /** PUT/PATCH /api/admin/posts/{post}. */
    public function update(Request $request, Post $post): JsonResponse
    {
        $data = $this->validateData($request);
        $data['cover'] = $this->resolveCover($request, $post);

        $post->update($data);

        return response()->json(['data' => $post]);
    }

    /** DELETE /api/admin/posts/{post}. */
    public function destroy(Post $post): JsonResponse
    {
        $this->deleteStoredCover($post->cover);
        $post->delete();

        return response()->json(['message' => 'Post deleted.']);
    }

    /* ----------------------------- helpers ----------------------------- */

    private function validateData(Request $request): array
    {
        if (is_string($request->input('tags'))) {
            $decoded = json_decode($request->input('tags'), true);
            $request->merge(['tags' => is_array($decoded) ? $decoded : array_values(array_filter(array_map('trim', explode(',', $request->input('tags')))))]);
        }

        return $request->validate([
            'title' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:220'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:40'],
            'read_time' => ['nullable', 'integer', 'min:1', 'max:120'],
            'published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);
    }

    private function resolveCover(Request $request, ?Post $post): ?string
    {
        if ($request->hasFile('cover')) {
            $this->deleteStoredCover($post?->cover);
            $path = $request->file('cover')->store('posts', 'public');
            return Storage::disk('public')->url($path);
        }

        return $request->input('cover', $post?->cover);
    }

    private function deleteStoredCover(?string $url): void
    {
        if (! $url) {
            return;
        }
        if (str_contains($url, '/storage/posts/')) {
            Storage::disk('public')->delete('posts/'.basename($url));
        }
    }
}
