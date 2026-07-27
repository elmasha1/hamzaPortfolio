<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Support\Cloudinary;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * The hero video on a case study.
 *
 * Kept off the project form on purpose: a 50 MB file inside the same multipart
 * save as every text field means one slow, fragile request that dies against
 * post_max_size and takes the rest of the edit with it. Uploading separately
 * also means the video is stored the moment it finishes, not when you remember
 * to press Save.
 */
class ProjectVideoController extends Controller
{
    /** POST /api/admin/projects/{project}/video (multipart `video`) */
    public function store(Request $request, Project $project): JsonResponse
    {
        // A file over post_max_size arrives as an empty request — no file, no
        // fields, no warning. Name the real limits instead of reporting a
        // missing field.
        if (! $request->hasFile('video') && (int) $request->server('CONTENT_LENGTH') > 0 && $request->all() === []) {
            return response()->json([
                'message' => 'The video exceeds what this server accepts (upload_max_filesize is '
                    .ini_get('upload_max_filesize').', post_max_size is '.ini_get('post_max_size')
                    .'). Compress the file or raise both limits in php.ini.',
            ], 422);
        }

        $request->validate([
            'video' => ['required', 'file', 'mimetypes:video/mp4,video/webm,video/quicktime', 'max:51200'], // ≤50 MB
        ]);

        $file = $request->file('video');

        $url = Cloudinary::upload($file, 'projects', 'video');
        if (! $url) {
            $name = 'project-'.$project->id.'-'.now()->format('YmdHis').'.'.$file->getClientOriginalExtension();
            $url = Storage::disk('public')->url($file->storeAs('videos', $name, 'public'));
        }

        Cloudinary::forget($project->video_url, 'videos', 'video');
        $project->update(['video_url' => $url]); // model save busts the public cache

        return response()->json(['data' => ['video_url' => $url]]);
    }

    /** DELETE — the case study falls back to its still image. */
    public function destroy(Project $project): JsonResponse
    {
        Cloudinary::forget($project->video_url, 'videos', 'video');
        $project->update(['video_url' => null]);

        return response()->json(['data' => ['video_url' => '']]);
    }
}
