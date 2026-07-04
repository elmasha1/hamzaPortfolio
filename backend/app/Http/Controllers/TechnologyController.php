<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class TechnologyController extends Controller
{
    /** Sensible defaults so the section renders before anything is edited. */
    public const DEFAULTS = [
        ['label' => 'Frontend', 'items' => [
            ['name' => 'React', 'icon' => 'react'],
            ['name' => 'Vite', 'icon' => 'vite'],
            ['name' => 'TypeScript', 'icon' => 'typescript'],
            ['name' => 'Tailwind CSS', 'icon' => 'tailwind'],
            ['name' => 'Framer Motion', 'icon' => 'framer'],
            ['name' => 'GSAP', 'icon' => 'gsap'],
            ['name' => 'JavaScript', 'icon' => 'javascript'],
        ]],
        ['label' => 'Backend', 'items' => [
            ['name' => 'Laravel', 'icon' => 'laravel'],
            ['name' => 'PHP', 'icon' => 'php'],
            ['name' => 'Node.js', 'icon' => 'nodejs'],
            ['name' => 'REST APIs', 'icon' => 'restapi'],
        ]],
        ['label' => 'Database', 'items' => [
            ['name' => 'MySQL', 'icon' => 'mysql'],
            ['name' => 'PostgreSQL', 'icon' => 'postgresql'],
            ['name' => 'Redis', 'icon' => 'redis'],
        ]],
        ['label' => 'DevOps & Tools', 'items' => [
            ['name' => 'Git', 'icon' => 'git'],
            ['name' => 'Docker', 'icon' => 'docker'],
            ['name' => 'CI/CD', 'icon' => 'cicd'],
            ['name' => 'Linux', 'icon' => 'linux'],
            ['name' => 'Figma', 'icon' => 'figma'],
        ]],
    ];

    /** Normalise: old string items → { name, icon:'' } so both shapes render. */
    public static function normalize($groups): array
    {
        if (! is_array($groups)) {
            return self::DEFAULTS;
        }

        return array_map(function ($g) {
            $items = array_map(function ($it) {
                if (is_string($it)) {
                    return ['name' => $it, 'icon' => ''];
                }
                return ['name' => $it['name'] ?? '', 'icon' => $it['icon'] ?? ''];
            }, $g['items'] ?? []);

            return ['label' => $g['label'] ?? '', 'items' => $items];
        }, $groups);
    }

    /** The grouped tech stack (normalized). */
    public static function payload(): array
    {
        $groups = Setting::get('tech_groups');

        return $groups ? self::normalize($groups) : self::DEFAULTS;
    }

    /** GET /api/technologies (public) — grouped tech stack. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => \App\Support\PublicCache::remember('technologies', fn () => self::payload()),
        ]);
    }
}
