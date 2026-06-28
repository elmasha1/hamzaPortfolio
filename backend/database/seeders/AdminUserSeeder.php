<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed a single admin account for the dashboard.
     * CHANGE THIS PASSWORD after first login in production.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@portfolio.test'],
            [
                'name' => 'Site Admin',
                'password' => Hash::make('password'),
            ]
        );
    }
}
