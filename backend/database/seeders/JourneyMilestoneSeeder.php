<?php

namespace Database\Seeders;

use App\Models\JourneyMilestone;
use Illuminate\Database\Seeder;

class JourneyMilestoneSeeder extends Seeder
{
    public function run(): void
    {
        $milestones = [
            ['date_label' => '2020', 'title' => 'The beginning', 'description' => 'Wrote my first lines of HTML and CSS and got hooked on turning ideas into things that run in a browser.', 'tags' => ['HTML', 'CSS', 'JavaScript']],
            ['date_label' => '2021', 'title' => 'Learning full-stack', 'description' => 'Went deep on React and Laravel — building real CRUD apps, auth flows and REST APIs on top of MySQL.', 'tags' => ['React', 'Laravel', 'MySQL']],
            ['date_label' => '2022', 'title' => 'First freelance projects', 'description' => 'Shipped paid work for real clients: landing pages, dashboards and small e-commerce builds.', 'tags' => ['Freelance', 'Client work']],
            ['date_label' => '2023', 'title' => 'Studies & fundamentals', 'description' => 'Formalised the theory — algorithms, databases and system design — alongside building.', 'tags' => ['CS', 'System design']],
            ['date_label' => '2024', 'title' => 'DevOps & deployment', 'description' => 'Owned shipping: Git workflows, CI/CD pipelines, Docker and running apps in production on Linux.', 'tags' => ['Docker', 'CI/CD', 'Linux']],
            ['date_label' => 'Present', 'title' => 'Building & shipping', 'description' => 'Working across the stack on production-grade products, with an eye on performance and craft.', 'tags' => ['Full-stack', 'Performance']],
        ];

        foreach ($milestones as $i => $m) {
            JourneyMilestone::updateOrCreate(
                ['title' => $m['title']],
                array_merge($m, ['order' => $i]),
            );
        }
    }
}
