<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $posts = [
            [
                'title' => 'Structuring a Laravel API for the long run',
                'excerpt' => 'How I keep controllers thin, validation explicit, and data models honest as a project grows from MVP to production.',
                'tags' => ['Laravel', 'Architecture', 'API'],
                'read_time' => 6,
                'body' => "When an API starts small it's tempting to put everything in the controller. That works — until it doesn't.\n\nI lean on form requests for validation, single-purpose service classes for anything with branching logic, and API resources to keep the response shape stable. The controller becomes a thin coordinator: validate, delegate, respond.\n\nThe payoff shows up months later, when a feature change touches one class instead of ten.",
            ],
            [
                'title' => 'GSAP + Lenis: smooth scroll without the jank',
                'excerpt' => 'Syncing ScrollTrigger to a smooth-scroll library the right way, and the pitfalls that cause pinned sections to jump.',
                'tags' => ['GSAP', 'React', 'Animation'],
                'read_time' => 5,
                'body' => "Smooth scroll and ScrollTrigger both want to own the scroll position. The fix is to make one the source of truth.\n\nI drive ScrollTrigger from Lenis via gsap.ticker, disable lag smoothing, and let Lenis report scroll. Pinned sections then track perfectly, and reduced-motion users get a clean vertical fallback.",
            ],
            [
                'title' => 'Designing for two colours',
                'excerpt' => 'What building a strictly black-and-white interface taught me about hierarchy, rhythm, and restraint.',
                'tags' => ['Design', 'CSS', 'Typography'],
                'read_time' => 4,
                'body' => "With no colour to lean on, hierarchy has to come from type scale, weight, spacing and motion.\n\nHairline dividers, a strict 8pt grid and generous whitespace do most of the work. Everything that remains has to earn its place — which, it turns out, is a good rule for interfaces in general.",
            ],
        ];

        foreach ($posts as $p) {
            Post::updateOrCreate(['title' => $p['title']], $p);
        }
    }
}
