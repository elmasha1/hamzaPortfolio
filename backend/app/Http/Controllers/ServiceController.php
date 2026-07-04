<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    /** Sensible defaults so the section is populated before anything is edited. */
    public const DEFAULTS = [
        ['icon' => 'Code', 'title' => 'Web App Development', 'description' => 'Fast, accessible React SPAs (Vite, Tailwind) with polished, production-ready UI.'],
        ['icon' => 'Server', 'title' => 'Backend & API Development', 'description' => 'Robust Laravel REST APIs — auth, validation, queues and clean data models.'],
        ['icon' => 'Database', 'title' => 'Database Design', 'description' => 'Well-structured MySQL schemas, migrations and performant queries.'],
        ['icon' => 'Rocket', 'title' => 'Full-Stack Solutions', 'description' => 'End-to-end delivery from architecture to deployment, wired together cleanly.'],
        ['icon' => 'LayoutGrid', 'title' => 'UI Implementation', 'description' => 'Pixel-precise, responsive interfaces from Figma with motion and micro-interactions.'],
    ];

    /** GET /api/services (public) — the services / capabilities list. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Support\PublicCache::remember('services', function () {
                $services = Setting::get('services');

                return is_array($services) ? $services : self::DEFAULTS;
            }),
        ]);
    }
}
