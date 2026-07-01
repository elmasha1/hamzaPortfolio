<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Seed the editable site settings the public React site reads.
     * All of these are editable from the dashboard Settings page.
     */
    public function run(): void
    {
        $defaults = [
            'whatsapp_number' => '212600000000', // intl format, no +
            'whatsapp_message' => 'Hi, I came across your portfolio and would like to discuss a project.',
            'hero_title' => 'I build production-grade web applications.',
            'hero_subtitle' => 'Full-stack engineer working with React & Laravel — from API design and database modeling to performance, testing and deployment.',
            'hero_roles' => ['Full Stack Engineer', 'React & Laravel Specialist', 'API & Systems Design'],
            'hero_eyebrow' => 'Full-Stack Developer',
            'hero_location' => 'Rabat ⇄ Remote · Code · Deploy · Maintain',
            'location' => 'Rabat, Morocco',
            'bio' => "I'm a full-stack engineer with 4+ years building and shipping web applications — React and Tailwind on the frontend, Laravel and MySQL on the backend. I care about clean architecture, performance, accessibility and tested, maintainable code.",
            'available' => true,
            'stats' => [
                ['label' => 'Years experience', 'value' => 4, 'suffix' => '+'],
                ['label' => 'Projects delivered', 'value' => 30, 'suffix' => '+'],
                ['label' => 'Clients served', 'value' => 15, 'suffix' => '+'],
                ['label' => 'Avg. Lighthouse', 'value' => 95, 'suffix' => '+'],
            ],
            'socials' => [
                'linkedin' => 'https://linkedin.com/',
                'github' => 'https://github.com/',
                'email' => 'lyrvmind@gmail.com',
            ],
            'testimonials' => [
                [
                    'quote' => 'Delivered a complex platform on time and communicated like a senior engineer throughout. The architecture has scaled cleanly as we have grown.',
                    'name' => 'Sarah Lin',
                    'role' => 'Product Lead, SaaS startup',
                ],
                [
                    'quote' => 'A rare combination of strong engineering and genuine design sense. Our app is faster, cleaner, and far easier to maintain.',
                    'name' => 'Marco Reyes',
                    'role' => 'CTO, Digital Agency',
                ],
                [
                    'quote' => 'Took ownership from API design to deployment and left us with documented, tested code. Would hire again without hesitation.',
                    'name' => 'Amelia Khan',
                    'role' => 'Founder, E-commerce',
                ],
            ],
            'tech_groups' => [
                ['label' => 'Frontend', 'items' => ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP']],
                ['label' => 'Backend', 'items' => ['Laravel', 'PHP', 'REST APIs', 'Sanctum / Auth', 'Queued Jobs']],
                ['label' => 'Database', 'items' => ['MySQL', 'Eloquent ORM', 'Redis']],
                ['label' => 'DevOps & Tools', 'items' => ['Git', 'Docker', 'CI/CD', 'Linux', 'Figma']],
            ],
            'services' => [
                ['icon' => 'Code', 'title' => 'Web App Development', 'description' => 'Fast, accessible React SPAs (Vite, Tailwind) with polished, production-ready UI.'],
                ['icon' => 'Server', 'title' => 'Backend & API Development', 'description' => 'Robust Laravel REST APIs — auth, validation, queues and clean data models.'],
                ['icon' => 'Database', 'title' => 'Database Design', 'description' => 'Well-structured MySQL schemas, migrations and performant queries.'],
                ['icon' => 'Rocket', 'title' => 'Full-Stack Solutions', 'description' => 'End-to-end delivery from architecture to deployment, wired together cleanly.'],
                ['icon' => 'LayoutGrid', 'title' => 'UI Implementation', 'description' => 'Pixel-precise, responsive interfaces from Figma with motion and micro-interactions.'],
            ],
            'overview_intro' => 'A full-stack engineer who takes products from idea to production — and keeps them running.',
            'overview_items' => [
                ['icon' => 'Code', 'title' => 'Full-Stack Web Development', 'description' => 'End-to-end web apps, from data model to polished interface.', 'tech' => ['React', 'Laravel', 'Node', 'TypeScript', 'MySQL'], 'tags' => ['3+ years', 'Full-stack']],
                ['icon' => 'Server', 'title' => 'Backend & APIs', 'description' => 'Robust REST APIs with auth, queues and clean architecture.', 'tech' => ['Laravel', 'REST', 'Sanctum', 'Redis'], 'tags' => ['APIs', 'Scalable']],
                ['icon' => 'Rocket', 'title' => 'Freelance Development', 'description' => 'Web apps, e-commerce, SaaS and third-party integrations for clients.', 'tech' => ['Stripe', 'Next.js', 'Webhooks'], 'tags' => ['Client work', 'Delivery']],
                ['icon' => 'GitBranch', 'title' => 'Personal & Open-Source', 'description' => 'Tools, writing and contributions I build to keep learning.', 'tech' => ['Open-source', 'DX tools', 'Writing'], 'tags' => ['Ongoing', 'Community']],
            ],
            'journey_heading' => 'From zero to full-stack.',
            'journey_intro' => 'A short version of how I went from writing my first lines of code to shipping full-stack products.',
            'journey' => [
                ['date' => '2020', 'title' => 'The beginning', 'description' => 'Wrote my first HTML/CSS and got hooked on turning ideas into things that run in a browser.', 'tags' => ['HTML', 'CSS', 'JavaScript']],
                ['date' => '2021', 'title' => 'Learning full-stack', 'description' => 'Went deep on React and Laravel — building real CRUD apps, auth flows and REST APIs.', 'tags' => ['React', 'Laravel', 'MySQL']],
                ['date' => '2022', 'title' => 'First freelance projects', 'description' => 'Shipped paid work for real clients: landing pages, dashboards and e-commerce.', 'tags' => ['Freelance', 'Client work']],
                ['date' => '2023', 'title' => 'Studies & fundamentals', 'description' => 'Formalised the theory — algorithms, databases and system design — alongside building.', 'tags' => ['CS', 'System design']],
                ['date' => '2024', 'title' => 'DevOps & cloud', 'description' => 'Owned deployment: Docker, CI/CD pipelines and running apps in production on Linux.', 'tags' => ['Docker', 'CI/CD', 'Linux']],
                ['date' => 'Present', 'title' => 'Building & shipping', 'description' => 'Working across the stack on production-grade products, with an eye on performance and craft.', 'tags' => ['Full-stack', 'Performance']],
            ],
            'about' => [
                'headline' => 'From idea to production — this is who I am.',
                'subline' => 'A full-stack engineer who cares as much about the craft as the outcome.',
                'video_url' => '',
                'video_poster' => '',
                'story' => [
                    "I started building for the web because I loved the immediacy of it — write a few lines, refresh, and something real appears in the browser. That feeling never left; it just grew into a career.",
                    "Over the last few years I've shipped production applications end to end — designing data models and REST APIs in Laravel and MySQL, then building fast, accessible interfaces in React on top. I've worked with clients and teams, owned features from architecture to deployment, and learned that the hard part is rarely the code — it's the decisions around it.",
                    "Today I focus on software that lasts: clean architecture, sensible abstractions, and interfaces that feel effortless. I'm always learning — the moment this stops being interesting is the moment I'm doing it wrong.",
                ],
                'pull_quote' => "The hard part is rarely the code — it's the decisions around it.",
                'philosophy' => [
                    ['title' => 'Clean architecture', 'description' => 'Sensible abstractions and clear boundaries, so change happens in one place.'],
                    ['title' => 'Performance by default', 'description' => 'Fast, accessible experiences — measured, not assumed.'],
                    ['title' => 'Ship, then refine', 'description' => 'Working software in front of people beats perfect software in a branch.'],
                    ['title' => 'Always learning', 'description' => 'The stack evolves; curiosity is the only durable skill.'],
                ],
                'facts' => [
                    ['label' => 'Years coding', 'value' => 4, 'suffix' => '+'],
                    ['label' => 'Projects shipped', 'value' => 30, 'suffix' => '+'],
                    ['label' => 'Based in', 'text' => 'Rabat / Remote'],
                ],
            ],
        ];

        foreach ($defaults as $key => $value) {
            Setting::put($key, $value);
        }
    }
}
