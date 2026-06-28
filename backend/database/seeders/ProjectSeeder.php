<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seed a handful of sample projects so the portfolio grid is
     * populated out of the box.
     */
    public function run(): void
    {
        $projects = [
            [
                'title'       => 'TaskFlow — Kanban App',
                'description' => 'A real-time Kanban board with drag & drop columns, labels and due dates. Built in React with a Laravel REST API and MySQL persistence.',
                'image'       => 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
                'tech_tags'   => ['React', 'Laravel', 'MySQL'],
                'live_url'    => 'https://example.com/taskflow',
                'github_url'  => 'https://github.com/your-username/taskflow',
            ],
            [
                'title'       => 'ShopWave — E-commerce',
                'description' => 'A modern storefront with cart, Stripe checkout and an admin dashboard. Tailwind UI on the front, Laravel API on the back.',
                'image'       => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
                'tech_tags'   => ['React', 'Tailwind', 'Laravel'],
                'live_url'    => 'https://example.com/shopwave',
                'github_url'  => 'https://github.com/your-username/shopwave',
            ],
            [
                'title'       => 'PulseAnalytics',
                'description' => 'An animated analytics dashboard with live charts and websockets. Heavy Framer Motion usage for smooth, delightful data transitions.',
                'image'       => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
                'tech_tags'   => ['React', 'Framer Motion', 'Tailwind'],
                'live_url'    => 'https://example.com/pulse',
                'github_url'  => 'https://github.com/your-username/pulse',
            ],
            [
                'title'       => 'DevNotes API',
                'description' => 'A markdown-powered notes API with authentication, tags and full-text search. Pure Laravel & MySQL with a clean RESTful design.',
                'image'       => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
                'tech_tags'   => ['Laravel', 'MySQL'],
                'live_url'    => 'https://example.com/devnotes',
                'github_url'  => 'https://github.com/your-username/devnotes',
            ],
            [
                'title'       => 'Aurora — Landing Page',
                'description' => 'A heavily animated marketing landing page with scroll-triggered reveals, parallax stickers and a custom cursor. Built with React + Framer Motion.',
                'image'       => 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
                'tech_tags'   => ['React', 'Tailwind', 'Framer Motion'],
                'live_url'    => 'https://example.com/aurora',
                'github_url'  => 'https://github.com/your-username/aurora',
            ],
            [
                'title'       => 'BookNest — Booking System',
                'description' => 'A full booking platform with calendar availability, email confirmations and a Laravel admin panel backed by MySQL.',
                'image'       => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
                'tech_tags'   => ['React', 'Laravel', 'MySQL'],
                'live_url'    => 'https://example.com/booknest',
                'github_url'  => 'https://github.com/your-username/booknest',
            ],
        ];

        foreach ($projects as $i => $project) {
            // First project is featured; the rest keep their array order.
            $project['featured'] = $i === 0;
            $project['order'] = $i;
            $project['role'] = 'Full-stack developer (design, frontend & API)';
            Project::create($project);
        }
    }
}
