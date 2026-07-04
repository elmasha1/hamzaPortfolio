<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class CvController extends Controller
{
    /**
     * Sensible default CV so the page/PDF look complete before anything is
     * edited in the dashboard. Saved values (Setting 'cv') override these.
     */
    public const DEFAULT_CV = [
        'name' => 'EL MASDOUKI Hamza',
        'role' => 'Full-Stack Developer / Software Engineer',
        'tagline' => 'I turn ideas into fast, accessible, production-grade web applications — end to end.',
        'email' => 'lyrvmind@gmail.com',
        'phone' => '',
        'github' => 'https://github.com/',
        'linkedin' => 'https://linkedin.com/',
        'website' => '',
        'location' => 'Rabat, Morocco',
        'summary' => 'Full-stack developer who loves the sweet spot between engineering and design. I build fast, accessible and beautifully animated apps with React, Tailwind & Framer Motion on the frontend, and robust REST APIs with Laravel & MySQL on the backend.',
        'experiences' => [
            [
                'title' => 'Full Stack Developer',
                'company' => 'Freelance',
                'start' => '2022',
                'end' => 'Present',
                'description' => "Designed and shipped end-to-end web apps for clients: React/Vite frontends with Laravel REST APIs and MySQL.\nFocused on performance, accessibility and polished micro-interactions.",
            ],
            [
                'title' => 'React Developer',
                'company' => 'Studio / Agency',
                'start' => '2020',
                'end' => '2022',
                'description' => "Built responsive, animated marketing sites and dashboards with React, Tailwind and Framer Motion.\nCollaborated with designers to translate Figma into pixel-perfect UI.",
            ],
        ],
        'education' => [
            [
                'degree' => 'B.Sc. Computer Science',
                'school' => 'University',
                'start' => '2018',
                'end' => '2022',
                'description' => '',
            ],
        ],
        'skills' => [
            'React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'JavaScript',
            'Laravel', 'PHP', 'MySQL', 'REST APIs', 'Git',
        ],
        'skill_groups' => [
            ['label' => 'Frontend', 'items' => ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP']],
            ['label' => 'Backend', 'items' => ['Laravel', 'PHP', 'REST APIs', 'Node.js', 'Sanctum / Auth']],
            ['label' => 'Database', 'items' => ['MySQL', 'Eloquent ORM', 'Redis']],
            ['label' => 'DevOps & Tools', 'items' => ['Git', 'Docker', 'CI/CD', 'Linux', 'Figma']],
        ],
        'projects' => [
            ['name' => 'Portfolio & CMS', 'description' => 'Editorial portfolio with a full Laravel admin dashboard and a client-generated PDF résumé.', 'tech' => 'React, Laravel, MySQL', 'link' => 'https://github.com/'],
            ['name' => 'Realtime Dashboard', 'description' => 'Analytics dashboard with a Laravel API and a fast, accessible React frontend.', 'tech' => 'React, Laravel, WebSockets', 'link' => 'https://github.com/'],
        ],
        'languages' => [
            ['name' => 'Arabic', 'level' => 'Native'],
            ['name' => 'English', 'level' => 'Fluent'],
            ['name' => 'French', 'level' => 'Professional'],
        ],
        'certifications' => [],
    ];

    /**
     * Merge saved CV over the defaults and attach the photo:
     * a dedicated cv_photo (more formal shot) wins, otherwise the site
     * profile photo, otherwise null → the placeholder initials show.
     */
    public static function payload(): array
    {
        $saved = Setting::get('cv');
        $cv = array_merge(self::DEFAULT_CV, is_array($saved) ? $saved : []);
        $cv['cv_photo'] = Setting::get('cv_photo') ?: null;
        $cv['photo'] = $cv['cv_photo'] ?: (Setting::get('profile_photo') ?: null);

        return $cv;
    }

    /** GET /api/cv — public CV data for the /cv page and the PDF. */
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => \App\Support\PublicCache::remember('cv', fn () => self::payload()),
        ]);
    }

    /**
     * GET /api/cv/photo — the CV photo as a base64 data-URI.
     *
     * The PDF generator draws the photo on a <canvas>; loading it straight
     * from /storage fails cross-origin (static files carry no CORS headers,
     * unlike this API route). Serving it as a data-URI sidesteps CORS and
     * canvas tainting entirely, in dev and production alike.
     */
    public function photo(): JsonResponse
    {
        $data = \App\Support\PublicCache::remember('cv-photo', function () {
            $url = Setting::get('cv_photo') ?: Setting::get('profile_photo');
            if (! $url) {
                return null;
            }

            // Locally stored upload → inline it. Remote URLs are returned
            // as-is (the browser may load them directly if they allow CORS).
            if (str_contains($url, '/storage/')) {
                $relative = ltrim(parse_url($url, PHP_URL_PATH), '/');
                $relative = preg_replace('#^storage/#', '', $relative);
                $disk = \Illuminate\Support\Facades\Storage::disk('public');
                if (! $disk->exists($relative)) {
                    return null;
                }
                $mime = $disk->mimeType($relative) ?: 'image/webp';

                return 'data:'.$mime.';base64,'.base64_encode($disk->get($relative));
            }

            return $url;
        });

        return response()->json(['data' => ['photo' => $data]]);
    }
}
