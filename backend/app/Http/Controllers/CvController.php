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
        'role' => 'Full Stack Developer',
        'email' => 'lyrvmind@gmail.com',
        'github' => 'https://github.com/',
        'location' => 'Morocco',
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
        'languages' => [
            ['name' => 'Arabic', 'level' => 'Native'],
            ['name' => 'English', 'level' => 'Fluent'],
            ['name' => 'French', 'level' => 'Professional'],
        ],
        'certifications' => [],
    ];

    /**
     * Merge saved CV over the defaults and attach the dashboard profile photo.
     */
    public static function payload(): array
    {
        $saved = Setting::get('cv');
        $cv = array_merge(self::DEFAULT_CV, is_array($saved) ? $saved : []);
        $cv['photo'] = Setting::get('profile_photo') ?: null;

        return $cv;
    }

    /** GET /api/cv — public CV data for the /cv page and the PDF. */
    public function show(): JsonResponse
    {
        return response()->json(['data' => self::payload()]);
    }
}
