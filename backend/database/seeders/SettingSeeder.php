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
            'whatsapp_message' => "Hi Mehdi, I saw your portfolio…",
            'hero_title' => 'I build refined, high-end web experiences.',
            'hero_subtitle' => 'I craft fast, accessible and beautifully animated apps with React, Tailwind, Laravel & MySQL — turning ideas into polished products.',
            'hero_roles' => ['Full Stack Developer', 'React Developer', 'Laravel Developer'],
            'bio' => "I'm a full-stack developer who loves the sweet spot between engineering and design.",
            'available' => true,
            'stats' => [
                ['label' => 'Years experience', 'value' => 4, 'suffix' => '+'],
                ['label' => 'Projects shipped', 'value' => 50, 'suffix' => '+'],
                ['label' => 'Happy clients', 'value' => 30, 'suffix' => '+'],
                ['label' => 'Cups of coffee', 'value' => 12, 'suffix' => 'k'],
            ],
            'socials' => [
                'linkedin' => 'https://linkedin.com/',
                'github' => 'https://github.com/',
                'email' => 'lyrvmind@gmail.com',
            ],
        ];

        foreach ($defaults as $key => $value) {
            Setting::put($key, $value);
        }
    }
}
