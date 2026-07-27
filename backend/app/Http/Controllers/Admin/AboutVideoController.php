<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\AboutController as PublicAboutController;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * The story video on the About page — uploaded from the dashboard instead of
 * being pasted in as a URL.
 *
 * Files land in storage/app/public/videos with a timestamped name, so every
 * upload gets a fresh URL and no browser serves a stale cached video. The URL
 * is written into the `about` setting's `video_url`, which is the same field an
 * external URL would use — so an uploaded file and a hosted one are
 * interchangeable, and removing either falls back to the placeholder frame.
 */
class AboutVideoController extends Controller
{
    /** POST /api/admin/about-video (multipart `video`) */
    public function store(Request $request): JsonResponse
    {
        // A file bigger than PHP's post_max_size arrives as an EMPTY request —
        // no file, no fields, no warning. Say what actually happened instead of
        // letting validation report a missing field.
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
        $name = 'story-'.now()->format('YmdHis').'.'.$file->getClientOriginalExtension();
        $stored = $file->storeAs('videos', $name, 'public');
        $url = Storage::disk('public')->url($stored);

        $about = $this->about();
        $this->deleteStored($about['video_url'] ?? null);
        $about['video_url'] = $url;
        Setting::put('about', $about); // also busts the public cache

        return response()->json(['data' => ['video_url' => $url]]);
    }

    /** DELETE — remove the video (the placeholder frame shows again). */
    public function destroy(): JsonResponse
    {
        $about = $this->about();
        $this->deleteStored($about['video_url'] ?? null);
        $about['video_url'] = '';
        Setting::put('about', $about);

        return response()->json(['data' => ['video_url' => '']]);
    }

    /* ----------------------------- helpers ----------------------------- */

    private function about(): array
    {
        $about = Setting::get('about');

        return is_array($about) ? $about : PublicAboutController::DEFAULTS;
    }

    /** Only ever delete files we stored ourselves — never an external URL. */
    private function deleteStored(?string $url): void
    {
        if ($url && str_contains($url, '/storage/videos/')) {
            Storage::disk('public')->delete('videos/'.basename(parse_url($url, PHP_URL_PATH)));
        }
    }
}
