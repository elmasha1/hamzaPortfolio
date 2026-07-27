<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seed professional engineering case studies (Problem → Architecture →
     * Key features → Challenges → Outcome) so the portfolio reads like real
     * delivered work out of the box.
     */
    public function run(): void
    {
        $projects = [
            [
                'title'       => 'Atlas — Multi-tenant SaaS Platform',
                'description' => 'A multi-tenant SaaS admin platform for managing customers, subscriptions and usage. React SPA backed by a Laravel REST API with role-based access control and Stripe billing.',
                'problem'     => 'The operations team managed customers across spreadsheets and three disconnected tools, causing billing errors and slow, manual onboarding.',
                'architecture_notes' => 'React (Vite) SPA + Laravel REST API. MySQL with tenant-scoped data, Sanctum token auth with RBAC, queued jobs for Stripe webhooks, Redis cache, containerised with Docker for consistent deploys.',
                'key_features' => [
                    'Tenant-scoped data isolation with role-based permissions',
                    'Stripe subscription billing with idempotent webhook reconciliation',
                    'Usage metering with exportable, scheduled reports',
                    'Full audit log of every administrative action',
                ],
                'challenges'  => 'Designing tenant isolation without duplicating business logic, and making Stripe webhooks safely idempotent under provider retries.',
                'outcome'     => 'Cut customer onboarding from days to under an hour and eliminated manual billing reconciliation; the platform now serves 1,200+ accounts.',
                'role'        => 'Lead full-stack developer — architecture, API design & frontend',
                'image'       => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80',
                'tech_tags'   => ['React', 'Laravel', 'MySQL', 'Stripe', 'Docker'],
                'live_url'    => 'https://example.com/atlas',
                'github_url'  => 'https://github.com/your-username/atlas',
            ],
            [
                'title'       => 'Ledger — Invoicing & Payments API',
                'description' => 'A RESTful invoicing and payments API powering billing for small businesses, with PDF invoices, recurring schedules and a signed webhook system.',
                'problem'     => 'Clients needed programmatic invoicing, but off-the-shelf SaaS was expensive and too rigid to fit their workflows.',
                'architecture_notes' => 'Laravel REST API + MySQL. Queued PDF generation, signed and versioned webhook delivery, OpenAPI-documented endpoints, 90%+ test coverage.',
                'key_features' => [
                    'Recurring invoices with proration',
                    'Idempotent payment processing & webhooks',
                    'Signed, versioned webhook delivery with retries',
                    'OpenAPI-documented, versioned REST endpoints',
                ],
                'challenges'  => 'Guaranteeing exactly-once webhook delivery and safe automatic retries without double-charging customers.',
                'outcome'     => 'Processes thousands of invoices per month with zero double-charges and reduced billing operations time by ~60%.',
                'role'        => 'Backend engineer — API design, data modeling & testing',
                'image'       => 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&q=80',
                'tech_tags'   => ['Laravel', 'MySQL', 'REST API', 'Queues'],
                'live_url'    => 'https://example.com/ledger',
                'github_url'  => 'https://github.com/your-username/ledger',
            ],
            [
                'title'       => 'Pulse — Realtime Analytics Dashboard',
                'description' => 'A realtime analytics dashboard streaming live events into interactive charts, built for product teams to watch funnels and conversions as they happen.',
                'problem'     => 'Stakeholders relied on next-day reports and could not react to live campaigns or incidents in time.',
                'architecture_notes' => 'React + WebSockets with Laravel broadcasting. MySQL with pre-aggregated rollups and virtualised tables to render large datasets smoothly.',
                'key_features' => [
                    'Live event stream over WebSockets',
                    'Funnel, retention and cohort visualisations',
                    'Virtualised rendering for 100k+ rows',
                    'Saved views and shareable dashboard links',
                ],
                'challenges'  => 'Keeping the UI at a steady 60fps while ingesting high-frequency events and re-rendering charts.',
                'outcome'     => 'Reduced time-to-insight from ~24 hours to seconds and was adopted across the growth team.',
                'role'        => 'Full-stack developer — realtime pipeline & frontend',
                'image'       => 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1000&q=80',
                'tech_tags'   => ['React', 'Laravel', 'WebSockets', 'Framer Motion'],
                'live_url'    => 'https://example.com/pulse',
                'github_url'  => 'https://github.com/your-username/pulse',
            ],
            [
                'title'       => 'Forge — Headless E-commerce',
                'description' => 'A headless storefront with cart, checkout and an admin catalog, decoupling a fast React frontend from a Laravel commerce API.',
                'problem'     => 'A monolithic store was slow on mobile and difficult for the marketing team to customise.',
                'architecture_notes' => 'React (Vite) storefront + Laravel commerce API. MySQL, Stripe checkout, image CDN and cached product queries for fast, repeatable reads.',
                'key_features' => [
                    'Headless catalog and cart API',
                    'Stripe checkout with order webhooks',
                    'Admin product & inventory management',
                    'CDN-cached, lazy-loaded media',
                ],
                'challenges'  => 'Cache invalidation on inventory changes without leaving customers with stale carts.',
                'outcome'     => 'Improved Largest Contentful Paint by ~40% and lifted mobile conversion.',
                'role'        => 'Full-stack developer — API, storefront & performance',
                'image'       => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&q=80',
                'tech_tags'   => ['React', 'Tailwind', 'Laravel', 'Stripe'],
                'live_url'    => 'https://example.com/forge',
                'github_url'  => 'https://github.com/your-username/forge',
            ],
            [
                'title'       => 'Relay — Internal Operations Tool',
                'description' => 'An internal operations tool that replaced spreadsheets for a logistics team: order tracking, role-based work queues and exportable reports.',
                'problem'     => 'Manual spreadsheet workflows caused lost orders and left no audit trail or accountability.',
                'architecture_notes' => 'React SPA + Laravel API, MySQL, Sanctum auth, queued exports and an activity log for traceability.',
                'key_features' => [
                    'Role-based work queues',
                    'Searchable, filterable order tables',
                    'Background CSV/PDF report exports',
                    'Full activity audit log',
                ],
                'challenges'  => 'Modeling a flexible status workflow the ops team could evolve without developer involvement.',
                'outcome'     => 'Cut order-handling errors significantly and gave managers real-time operational visibility.',
                'role'        => 'Full-stack developer — requirements, API & UI',
                'image'       => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80',
                'tech_tags'   => ['React', 'Laravel', 'MySQL'],
                'live_url'    => 'https://example.com/relay',
                'github_url'  => 'https://github.com/your-username/relay',
            ],
        ];

        foreach ($projects as $i => $project) {
            $project['featured'] = $i === 0;
            $project['order'] = $i;

            // Keyed on title so re-running the seeder updates the demo rows
            // instead of stacking duplicates — the other seeders are already
            // idempotent, and on a host without shell access seeding happens
            // from the deploy, where "run twice" is a normal accident.
            Project::updateOrCreate(['title' => $project['title']], $project);
        }
    }
}
