<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilePhotoController extends Controller
{
    private const MAX_DIMENSION = 1200; // px, longest side after resize

    /** Which setting the photo URL is saved to (overridden by CvPhotoController). */
    protected const SETTING_KEY = 'profile_photo';

    /** Stored filename prefix. */
    protected const NAME_PREFIX = 'profile';

    /**
     * POST /api/admin/profile-photo (multipart `photo`)
     *
     * Validates, optimizes (GD resize to ≤1200px + webp conversion when
     * available), stores under storage/app/public/profile with a timestamped
     * name (new URL every upload → no stale browser image cache), deletes the
     * previous file, and saves the public URL to the `profile_photo` setting —
     * which the hero, about portrait and CV all read.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'], // ≤4 MB
        ]);

        $file = $request->file('photo');
        $dir = 'profile';
        $name = static::NAME_PREFIX.'-'.now()->format('YmdHis');

        $stored = $this->optimizeAndStore($file->getRealPath(), $dir, $name)
            // GD unavailable or failed → store the original upload as-is.
            ?? $file->storeAs($dir, $name.'.'.$file->getClientOriginalExtension(), 'public');

        $url = Storage::disk('public')->url($stored);

        $this->deleteStored(Setting::get(static::SETTING_KEY));
        Setting::put(static::SETTING_KEY, $url); // also busts the public cache

        return response()->json(['data' => [static::SETTING_KEY => $url]]);
    }

    /** DELETE — remove the photo (fallback/placeholder shows). */
    public function destroy(): JsonResponse
    {
        $this->deleteStored(Setting::get(static::SETTING_KEY));
        Setting::put(static::SETTING_KEY, '');

        return response()->json(['data' => [static::SETTING_KEY => '']]);
    }

    /* ----------------------------- helpers ----------------------------- */

    /**
     * Resize to ≤MAX_DIMENSION and encode as webp (quality 82) via GD.
     * Returns the stored relative path, or null when GD can't handle it.
     */
    private function optimizeAndStore(string $srcPath, string $dir, string $name): ?string
    {
        if (! extension_loaded('gd')) {
            return null;
        }

        $info = @getimagesize($srcPath);
        if (! $info) {
            return null;
        }

        $img = match ($info[2]) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($srcPath),
            IMAGETYPE_PNG => @imagecreatefrompng($srcPath),
            IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($srcPath) : null,
            default => null,
        };
        if (! $img) {
            return null;
        }

        [$w, $h] = $info;
        $scale = min(1, self::MAX_DIMENSION / max($w, $h));
        if ($scale < 1) {
            $img = imagescale($img, (int) round($w * $scale), (int) round($h * $scale), IMG_BICUBIC);
        }

        // Preserve PNG transparency through the webp encode.
        imagepalettetotruecolor($img);
        imagealphablending($img, true);
        imagesavealpha($img, true);

        if (! function_exists('imagewebp')) {
            imagedestroy($img);

            return null;
        }

        $relative = "{$dir}/{$name}.webp";
        Storage::disk('public')->makeDirectory($dir);
        $ok = imagewebp($img, Storage::disk('public')->path($relative), 82);
        imagedestroy($img);

        return $ok ? $relative : null;
    }

    /** Delete a previously stored profile photo (only files we manage). */
    private function deleteStored(?string $url): void
    {
        if ($url && str_contains($url, '/storage/profile/')) {
            Storage::disk('public')->delete('profile/'.basename(parse_url($url, PHP_URL_PATH)));
        }
    }
}
